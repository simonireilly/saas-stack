// Cognito helpers

import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity'
import {
  fromCognitoIdentityPool,
  FromCognitoIdentityPoolParameters,
} from '@aws-sdk/credential-provider-cognito-identity'
import { REGION } from './base'

const identityPoolId = String(process.env.NEXT_PUBLIC_IDENTITY_POOL_ID)
const providerName = `cognito-idp.${REGION}.amazonaws.com/${process.env.NEXT_PUBLIC_USER_POOL_ID}`

const cognitoClient = new CognitoIdentityClient({
  region: REGION,
})

/**
 * If idToken exists, use authenticated permissions for dynamo
 *
 * @param idToken
 */
export const cognitoCredentialProvider = (
  idToken: string | undefined
): ReturnType<typeof fromCognitoIdentityPool> => {
  const config: FromCognitoIdentityPoolParameters = {
    client: cognitoClient,
    identityPoolId,
  }

  if (idToken) {
    config['logins'] = {
      [providerName]: idToken,
    }
  }

  return fromCognitoIdentityPool(config)
}
