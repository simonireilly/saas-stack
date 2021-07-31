import { Construct, Stack } from "@aws-cdk/core";
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from "@aws-cdk/custom-resources";

export interface PrincipalTagAttributeMapProp {
    cognitoIdentityPoolRef: string;
    userPoolId: string;
    principalTags: {
        [key: string]: string
    }
}
/**
 * To support multi-tenancy, in federated identities, it is possible to forward
 * claims into the resource
 */
export class PrincipalTagAttributeMap extends Construct {
    constructor(scope: Construct, id: string, props: PrincipalTagAttributeMapProp) {
        super(scope, id);
        new AwsCustomResource(this, 'SetPrincipalTagAttributeMapCognito', {
            installLatestAwsSdk: false,
            onCreate: {
                service: 'CognitoIdentity',
                action: 'setPrincipalTagAttributeMap',
                parameters: {
                    IdentityPoolId: props.cognitoIdentityPoolRef,
                    IdentityProviderName: `cognito-idp.${Stack.of(this).region}.amazonaws.com/${props.userPoolId}`,
                    PrincipalTags: props.principalTags,
                    UseDefaults: false
                },
                physicalResourceId: PhysicalResourceId.of('cognito-set-principal-tags')
            },
            onUpdate: {
                service: 'CognitoIdentity',
                action: 'setPrincipalTagAttributeMap',
                parameters: {
                    IdentityPoolId: props.cognitoIdentityPoolRef,
                    IdentityProviderName: `cognito-idp.${Stack.of(this).region}.amazonaws.com/${props.userPoolId}`,
                    PrincipalTags: props.principalTags,
                    UseDefaults: false
                },
                physicalResourceId: PhysicalResourceId.of('cognito-set-principal-tags')
            },
            onDelete: {
                service: 'CognitoIdentity',
                action: 'setPrincipalTagAttributeMap',
                parameters: {
                    IdentityPoolId: props.cognitoIdentityPoolRef,
                    IdentityProviderName: `cognito-idp.${Stack.of(this).region}.amazonaws.com/${props.userPoolId}`,
                    UseDefaults: true,
                },
                physicalResourceId: PhysicalResourceId.of('cognito-set-principal-tags')
            },
            policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: AwsCustomResourcePolicy.ANY_RESOURCE })
        })
    }
}
