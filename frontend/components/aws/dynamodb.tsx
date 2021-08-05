import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { fromCognitoIdentityPool, FromCognitoIdentityPoolParameters } from "@aws-sdk/credential-provider-cognito-identity";
import { DynamoDBDocumentClient, GetCommand, GetCommandOutput } from "@aws-sdk/lib-dynamodb";
import { FC, FormEvent, useContext, useEffect, useState } from "react";
import { UserStore } from "../../contexts/user-provider";

const REGION = process.env.NEXT_PUBLIC_REGION
const identityPoolId = String(process.env.NEXT_PUBLIC_IDENTITY_POOL_ID)
const TableName = String(process.env.NEXT_PUBLIC_MULTI_TENANT_TABLE_NAME)

const providerName = `cognito-idp.${REGION}.amazonaws.com/${process.env.NEXT_PUBLIC_USER_POOL_ID}`

const cognitoClient = new CognitoIdentityClient({
  region: REGION,
})

const getItem = async (userClient: DynamoDBDocumentClient,  pk: string) => {
  let item: GetCommandOutput & {status?: 'success' | 'failure', message?: string} = {
    $metadata: { },
    status: 'success',
  };

  try {
    console.info('Fetching item', { pk })

    item = await userClient.send(new GetCommand({
        TableName,
        Key: {
            pk,
            sk: 'EXAMPLE'
        }
    }))
    console.info(item)
    item['status'] = 'success'
  } catch (e) {
    console.error('Failing pk', { pk, e })
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
const cognitoCredentialProvider = (idToken: string | undefined) => {
  const config: FromCognitoIdentityPoolParameters = {
    client: cognitoClient,
    identityPoolId,
  }


  if(idToken) {
    console.info('Setting login token')

    config['logins'] = {
      [providerName]: idToken
    }
  }

  return fromCognitoIdentityPool(config)
}

export const DynamoComponent: FC = () => {
  const { user, authState} = useContext(UserStore)
  const [userClient, setUserClient] = useState<DynamoDBDocumentClient>()
  const [pk, setPk] = useState<string>('')
  const [item, setItem] = useState<Record<string, unknown>>()

  useEffect(() => {
    let idToken = undefined

    if(user) {
      idToken = user.signInUserSession?.idToken.jwtToken
    }

    const credentials = cognitoCredentialProvider(idToken)

    const cognitoDynamoClient = new DynamoDBClient({
        credentials: credentials,
        region: REGION,
    });

    const ddbDocClient = DynamoDBDocumentClient.from(cognitoDynamoClient);

    setUserClient(ddbDocClient)
  }, [user, authState])


  const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if(userClient) {
      const item = await getItem(userClient, pk)
      setItem(item)
    }
  }

  return <div
    style={{
      width: "100%"
    }}
  >
    <h1>Multi-tenant Dynamo</h1>
    <div style={{
      display: "flex",
      flexDirection: "column",
      flexBasis: "0",
    }}>
      <div>
        <p>
          This dynamoDB client is secured to allow authenticated users to access
          resources, which belong to their organisation.
        </p>
        {
          user && (
            <p>
              Try querying your own tenant with the code:
              <br/>
              <code>{user.signInUserSession?.idToken.payload['custom:org']}#</code>
            </p>
          )
        }
        <p>
          Try querying public data available to everyone with:
          <br />
          <code>PUBLIC#1</code>
        </p>
        <form onSubmit={handleOnSubmit}>
          <h3>Get item:</h3>
          <label>
            Primary Key:{' '}
            <input
              type="text"
              value={pk}
              onChange={e => setPk(e.target.value)}
              size={40}
              />
          </label>
          <button type="submit">Get Item</button>
        </form>
      </div>
      <div>
        <pre style={{
          whiteSpace: "pre-wrap"
        }}>
          {
            JSON.stringify(item, undefined, 2)
          }
        </pre>
      </div>
    </div>
  </div>
}
