import * as sst from '@serverless-stack/resources'
import * as cdk from '@aws-cdk/core'
import { Effect, PolicyStatement } from '@aws-cdk/aws-iam'
import { MultiStackProps } from '.'

export class DataStack extends sst.Stack {
  public readonly table: sst.Table

  constructor(scope: sst.App, id: string, props: MultiStackProps) {
    super(scope, id, props)

    // Create a simple table
    this.table = new sst.Table(this, 'DynamoDBTableResource', {
      fields: {
        pk: sst.TableFieldType.STRING,
        sk: sst.TableFieldType.STRING,
      },
      primaryIndex: {
        partitionKey: 'pk',
        sortKey: 'sk',
      },
      dynamodbTable: {
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      },
    })

    const publicPolicy = new PolicyStatement({
      sid: 'AllowPrecedingKeysToDynamoDBPublic',
      effect: Effect.ALLOW,
      actions: ['dynamodb:GetItem', 'dynamodb:Query'],
      resources: [this.table.tableArn],
      conditions: {
        'ForAllValues:StringLike': {
          'dynamodb:LeadingKeys': ['PUBLIC#*'],
        },
      },
    })

    /**
     * Policy that enables a tenant to access their entire organizations data.
     *
     * Entires in dynamoDB needs to begin with
     *
     */
    const tenantPolicy = new PolicyStatement({
      sid: 'AllowPrecedingKeysToDynamoDBOrganisation',
      effect: Effect.ALLOW,
      actions: ['dynamodb:GetItem', 'dynamodb:Query'],
      resources: [this.table.tableArn],
      conditions: {
        'ForAllValues:StringLike': {
          'dynamodb:LeadingKeys': ['${aws:PrincipalTag/org}#*'],
        },
      },
    })

    props.auth && props.auth.attachPermissionsForUnauthUsers([publicPolicy])

    props.auth &&
      props.auth.attachPermissionsForAuthUsers([publicPolicy, tenantPolicy])

    this.addOutputs({
      TableName: this.table.tableName,
    })
  }
}
