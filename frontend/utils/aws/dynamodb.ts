import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
  fromCognitoIdentityPool,
  FromCognitoIdentityPoolParameters,
} from '@aws-sdk/credential-provider-cognito-identity'
import {
  DynamoDBDocumentClient,
  GetCommand,
  GetCommandOutput,
} from '@aws-sdk/lib-dynamodb'
import { User } from '../../contexts/user-provider'

const REGION = process.env.NEXT_PUBLIC_REGION
const identityPoolId = String(process.env.NEXT_PUBLIC_IDENTITY_POOL_ID)
const TableName = String(process.env.NEXT_PUBLIC_MULTI_TENANT_TABLE_NAME)

const providerName = `cognito-idp.${REGION}.amazonaws.com/${process.env.NEXT_PUBLIC_USER_POOL_ID}`

const cognitoClient = new CognitoIdentityClient({
  region: REGION,
})

export const buildClient = (user: User | undefined): DynamoDBDocumentClient => {
  let idToken = undefined

  if (user) {
    idToken = user.signInUserSession?.idToken.jwtToken
  }

  const credentials = cognitoCredentialProvider(idToken)
  console.info('Curried')
  const cognitoDynamoClient = new DynamoDBClient({
    credentials: credentials,
    region: REGION,
  })

  return DynamoDBDocumentClient.from(cognitoDynamoClient)
}

export const getItem = async (
  userClient: DynamoDBDocumentClient,
  pk: string
): Promise<Record<string, unknown>> => {
  let item: GetCommandOutput & {
    status?: 'success' | 'failure'
    message?: string
  } = {
    $metadata: {},
    status: 'success',
  }

  try {
    item = await userClient.send(
      new GetCommand({
        TableName,
        Key: {
          pk,
          sk: 'EXAMPLE',
        },
      })
    )
    item['status'] = 'success'
  } catch (e) {
    item['status'] = 'failure'
    item['message'] = e.message
    item['$metadata'] = e.$metadata
  }

  return item
}

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
