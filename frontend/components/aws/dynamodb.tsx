import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { DynamoDBDocumentClient, GetCommand, GetCommandOutput } from "@aws-sdk/lib-dynamodb";
import { FC, FormEvent, useEffect, useState } from "react";

const REGION = process.env.NEXT_PUBLIC_REGION
const identityPoolId = String(process.env.NEXT_PUBLIC_IDENTITY_POOL_ID)
const TableName = String(process.env.MULTI_TENANT_TABLE_NAME)

const providerName = `cognito-idp.${REGION}.amazonaws.com/${process.env.NEXT_PUBLIC_USER_POOL_ID}`

const cognitoClient = new CognitoIdentityClient({
  region: REGION,
})

const getItem = async (userClient: DynamoDBDocumentClient,  pk: string) => {
  let item: GetCommandOutput & {status?: 'success' | 'failure'} = {
    $metadata: { },
    status: 'success',
  };

  try {
    console.info('Fetching item', { pk })

    item = await userClient.send(new GetCommand({
        TableName,
        Key: {
            pk,
            sk: 'allowed'
        }
    }))
    item['status'] = 'success'
  } catch (e) {
    console.error('Failing pk', { pk, e })
    item['status'] = 'failure'
    item['$metadata'] = e.$metadata
  }

  return item
}

// Set the default credentials.
const cognitoCredentialProvider = (idToken: string) => fromCognitoIdentityPool({
  client: cognitoClient,
  identityPoolId,
  logins: {
    [providerName]: idToken
  }
})

export const DynamoComponent: FC<{idToken: string}> = ({idToken}) => {
  const [userClient, setUserClient] = useState<DynamoDBDocumentClient>()
  const [pk, setPk] = useState<string>('')
  const [item, setItem] = useState<Record<string, unknown>>()

  useEffect(() => {
    const credentials = cognitoCredentialProvider(idToken)

    const cognitoDynamoClient = new DynamoDBClient({
        credentials: credentials,
        region: REGION,
    });

    const ddbDocClient = DynamoDBDocumentClient.from(cognitoDynamoClient);

    setUserClient(ddbDocClient)
  }, [idToken])


  const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if(userClient) {
      const item = await getItem(userClient, pk)
      setItem(item)
    }
  }

  return <div>
    <h1>Multi-tenant Dynamo</h1>
    <p>
      This dynamoDB client is secured to allow authenticated users to access
      resources, which belong to their organisation.
    </p>
    <form onSubmit={handleOnSubmit}>
      <h3>Get item:</h3>
      <label>
        Primary Key:{' '}
        <input
          type="text"
          value={pk}
          onChange={e => setPk(e.target.value)} />
      </label>
      <button type="submit">Get Item</button>
    </form>

    <pre>
      {
        JSON.stringify(item, undefined, 2)
      }
    </pre>
  </div>
}
