import { Construct, Stack } from '@aws-cdk/core'
import {
  AwsCustomResource,
  AwsCustomResourcePolicy,
  PhysicalResourceId,
} from '@aws-cdk/custom-resources'

export interface PrincipalTagAttributeMapProp {
  cognitoIdentityPoolRef: string
  userPoolId: string
  principalTags: {
    [key: string]: string
  }
}

/**
 * To support multi-tenancy, in federated identities, it is possible to forward
 * claims into the role assumed by the user.
 *
 * To do this, a map of values is set, see: https://www.youtube.com/watch?v=tAUmz94O2Qo
 */
export class PrincipalTagAttributeMap extends Construct {
  readonly resource: AwsCustomResource

  constructor(
    scope: Construct,
    id: string,
    props: PrincipalTagAttributeMapProp
  ) {
    super(scope, id)

    const awsSdkCall = this.buildAwsSdkCall(props)

    this.resource = new AwsCustomResource(
      this,
      'SetPrincipalTagAttributeMapCognito',
      {
        installLatestAwsSdk: false,
        onCreate: awsSdkCall,
        onUpdate: awsSdkCall,
        onDelete: {
          ...awsSdkCall,
          parameters: { ...awsSdkCall.parameters, UseDefaults: true },
        },
        policy: AwsCustomResourcePolicy.fromSdkCalls({
          resources: AwsCustomResourcePolicy.ANY_RESOURCE,
        }),
      }
    )
  }

  private buildAwsSdkCall(props: PrincipalTagAttributeMapProp) {
    return {
      service: 'CognitoIdentity',
      action: 'setPrincipalTagAttributeMap',
      parameters: {
        IdentityPoolId: props.cognitoIdentityPoolRef,
        IdentityProviderName: `cognito-idp.${
          Stack.of(this).region
        }.amazonaws.com/${props.userPoolId}`,
        PrincipalTags: props.principalTags,
        UseDefaults: false,
      },
      physicalResourceId: PhysicalResourceId.of('cognito-set-principal-tags'),
    }
  }
}
