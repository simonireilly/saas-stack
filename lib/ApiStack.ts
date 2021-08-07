import * as sst from '@serverless-stack/resources'
import * as cdk from '@aws-cdk/core'
import { PrincipalTagAttributeMap } from './custom-resources/SetPrincipalIdentityAttributesCognito'
import { StringAttribute, UserPoolOperation } from '@aws-cdk/aws-cognito'
import { Effect, Policy, PolicyStatement } from '@aws-cdk/aws-iam'

export default class ApiStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props)

    this.addOutputs({})
  }
}
