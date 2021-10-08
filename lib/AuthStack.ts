import * as sst from '@serverless-stack/resources'
import * as cdk from '@aws-cdk/core'
import { PrincipalTagAttributeMap } from './custom-resources/SetPrincipalIdentityAttributesCognito'
import { StringAttribute, UserPoolOperation } from '@aws-cdk/aws-cognito'
import { Policy, PolicyStatement } from '@aws-cdk/aws-iam'

export class AuthStack extends sst.Stack {
  public readonly auth: sst.Auth

  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props)

    // Add cognito auth
    this.auth = new sst.Auth(this, 'BaseAuth', {
      cognito: {
        userPool: {
          // Users will login using their email and password
          signInAliases: { email: true, phone: true },
          customAttributes: {
            // Require a uuidV4 for the org id
            org: new StringAttribute({
              minLen: 36,
              maxLen: 36,
              mutable: true,
            }),
          },
          removalPolicy: cdk.RemovalPolicy.DESTROY,
        },
      },
    })

    const postConfirmationFunction = new sst.Function(
      this,
      'PostConfirmationFunction',
      {
        handler: 'src/backend/lambda.postConfirmation',
      }
    )

    this.auth.cognitoUserPool?.addTrigger(
      UserPoolOperation.POST_CONFIRMATION,
      postConfirmationFunction
    )

    postConfirmationFunction.role?.attachInlinePolicy(
      new Policy(this, 'userpool-policy', {
        statements: [
          new PolicyStatement({
            actions: ['cognito-idp:AdminUpdateUserAttributes'],
            resources: [this.auth.cognitoUserPool?.userPoolArn || ''],
          }),
        ],
      })
    )

    /**
     * Take custom:org from the cognito id token, and forward it to the cognito
     * federated identity
     */
    new PrincipalTagAttributeMap(this, 'MultiTenancyCognitoConfig', {
      cognitoIdentityPoolRef: this.auth.cognitoCfnIdentityPool.ref,
      userPoolId: this.auth.cognitoUserPool?.userPoolId || '',
      principalTags: {
        org: 'custom:org',
        username: 'sub',
        client: 'aud',
      },
    })

    this.addOutputs({
      IdentityPoolId: this.auth.cognitoCfnIdentityPool.ref,
      UserPoolId: this.auth.cognitoUserPool?.userPoolId || '',
      ClientId: this.auth.cognitoUserPoolClient?.userPoolClientId || '',
    })
  }
}
