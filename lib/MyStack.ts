import * as sst from "@serverless-stack/resources";
import * as cdk from '@aws-cdk/core'
import { PrincipalTagAttributeMap } from "./constructs/SetPrincipalIdentityAttributesCognito";
import { StringAttribute, UserPoolOperation } from "@aws-cdk/aws-cognito";
import { Effect, Policy, PolicyStatement } from "@aws-cdk/aws-iam";


export default class MyStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    // Add cognito auth
    const auth = new sst.Auth(this, 'BaseAuth', {
      cognito: {
        userPool: {
          // Users will login using their email and password
          signInAliases: { email: true, phone: true },
          customAttributes: {
            // Require a uuidV4 for the org id
            org: new StringAttribute({
              minLen: 36,
              maxLen: 36,
              mutable: true
            })
          },
          removalPolicy: cdk.RemovalPolicy.DESTROY,
        },
      },
    })

    const postConfirmationFunction = new sst.Function(this, 'PostConfirmationFunction', {
      handler: 'src/lambda.postConfirmation'
    })

    const preTokenGeneration = new sst.Function(this, 'PreTokenGenerationFunction', {
      handler: 'src/lambda.preTokenGeneration'
    })

    auth.cognitoUserPool?.addTrigger(
      UserPoolOperation.POST_CONFIRMATION,
      postConfirmationFunction
    )

    auth.cognitoUserPool?.addTrigger(
      UserPoolOperation.PRE_TOKEN_GENERATION,
      preTokenGeneration
    )

    postConfirmationFunction.role?.attachInlinePolicy(new Policy(this, 'userpool-policy', {
      statements: [new PolicyStatement({
        actions: ['cognito-idp:AdminUpdateUserAttributes'],
        resources: [auth.cognitoUserPool?.userPoolArn || ''],
      })],
    }));

    // Create a simple table
    const table = new sst.Table(this, 'DynamoDBTableResource', {
      fields: {
        pk: sst.TableFieldType.STRING,
        sk: sst.TableFieldType.STRING
      },
      primaryIndex: {
        partitionKey: 'pk',
        sortKey: 'sk'
      },
      dynamodbTable: {
        removalPolicy: cdk.RemovalPolicy.DESTROY
      }
    })

    // Update to use non-default principal mapping
    new PrincipalTagAttributeMap(this, 'MultiTenancyCognitoConfig', {
      cognitoIdentityPoolRef: auth.cognitoCfnIdentityPool.ref,
      userPoolId: auth.cognitoUserPool?.userPoolId || "",
      principalTags: {
        // Add custom org claim to develop tenant based fine grained access
        // control
        org: 'org',
        // Keep default mappings required by trust relationship
        username: 'sub',
        client: 'aud'
      }
    })

    const publicPolicy = new PolicyStatement({
      sid: "AllowPrecedingKeysToDynamoDBPublic",
      effect: Effect.ALLOW,
      actions: [
        "dynamodb:GetItem",
        "dynamodb:Query"
      ],
      resources: [
        table.tableArn
      ],
      conditions: {
        "ForAllValues:StringLike": {
          "dynamodb:LeadingKeys": [
            "PUBLIC#*"
          ]
        }
      },
    })

    /**
     * Policy that enables a tenant to access their entire org's data
     */
    const tenantPolicy = new PolicyStatement({
      sid: "AllowPrecedingKeysToDynamoDBOrganisation",
      effect: Effect.ALLOW,
      actions: [
        "dynamodb:GetItem",
        "dynamodb:Query"
      ],
      resources: [
        table.tableArn
      ],
      conditions: {
        "ForAllValues:StringLike": {
          "dynamodb:LeadingKeys": [
            "${aws:PrincipalTag/org}#*"
          ]
        }
      },
    })

    auth.attachPermissionsForUnauthUsers([
      publicPolicy
    ]);

    auth.attachPermissionsForAuthUsers([
      publicPolicy,
      tenantPolicy
    ])

    this.addOutputs({
      'IdentityPoolId': auth.cognitoCfnIdentityPool.ref,
      'UserPoolId': auth.cognitoUserPool?.userPoolId || '',
      'ClientId': auth.cognitoUserPoolClient?.userPoolClientId || '',
      'TableName': table.tableName,
      'Role': JSON.stringify(auth.iamAuthRole.assumeRolePolicy)
    })
  }
}
