import { DynamoDBClient } from '@aws-sdk/client-dynamodb'

import {
  DynamoDBDocumentClient,
  GetCommand,
  GetCommandOutput,
} from '@aws-sdk/lib-dynamodb'
import { User } from '../../contexts/user-provider'
import { REGION } from './base'
import { cognitoCredentialProvider } from './cognito'

const TableName = String(process.env.NEXT_PUBLIC_MULTI_TENANT_TABLE_NAME)

export const buildClient = (user: User | undefined): DynamoDBDocumentClient => {
  let idToken = undefined

  if (user) {
    idToken = user.signInUserSession?.idToken.jwtToken
  }

  const credentials = cognitoCredentialProvider(idToken)

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
