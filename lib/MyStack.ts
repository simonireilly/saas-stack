import { Effect, PolicyStatement } from "@aws-cdk/aws-iam";
import * as sst from "@serverless-stack/resources";
import { PrincipalTagAttributeMap } from "./constructs/SetPrincipalIdentityAttributesCognito";

export default class MyStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    // Add cognito auth
    const auth = new sst.Auth(this, 'BaseAuth', {
      cognito: true,
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


    this.addOutputs({
      'IdentityPoolId': auth.cognitoCfnIdentityPool.ref,
      'UserPoolId': auth.cognitoUserPool?.userPoolId || '',
      'ClientId': auth.cognitoUserPoolClient?.userPoolClientId || '',
      'TableName': table.tableName
    })
  }
}
