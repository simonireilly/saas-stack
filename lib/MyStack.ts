import * as sst from "@serverless-stack/resources";
import * as cdk from '@aws-cdk/core'
import { StringAttribute } from "@aws-cdk/aws-cognito";
import { Effect, PolicyStatement } from "@aws-cdk/aws-iam";
import { PrincipalTagAttributeMap } from "./constructs/SetPrincipalIdentityAttributesCognito";

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
            // Require a uuidV4 for the org iid
            org: new StringAttribute({
              minLen: 36,
              maxLen: 36,
              mutable: false
            })
          },
          removalPolicy: cdk.RemovalPolicy.DESTROY
        },
      },
    })

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
        org: 'org'
      }
    })

    const publicPolicy = new PolicyStatement({
      sid: "AllowPrecedingKeysToDynamoDBPublic",
      effect: Effect.ALLOW,
      actions: [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
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


    const tenantPolicy = new PolicyStatement({
      sid: "AllowPrecedingKeysToDynamoDBOrganisation",
      effect: Effect.ALLOW,
      actions: [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
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
      tenantPolicy,
      publicPolicy
    ])

    // Deploy our React app
    const site = new sst.ReactStaticSite(this, "NextJSSite", {
      path: "frontend",
      buildOutput: "out",
    });

    this.addOutputs({
      SiteUrl: site.url,
      'IdentityPoolId': auth.cognitoCfnIdentityPool.ref,
      'UserPoolId': auth.cognitoUserPool?.userPoolId || '',
      'ClientId': auth.cognitoUserPoolClient?.userPoolClientId || '',
      'TableName': table.tableName
    })
  }
}
