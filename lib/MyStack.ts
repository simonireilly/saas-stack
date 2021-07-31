import { Effect, PolicyStatement } from "@aws-cdk/aws-iam";
import * as sst from "@serverless-stack/resources";

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

    auth.attachPermissionsForUnauthUsers([
      new PolicyStatement({
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
      }),
    ]);


    this.addOutputs({
      'IdentityPoolId': auth.cognitoCfnIdentityPool.ref,
      'TableName': table.tableName
    })
  }
}
