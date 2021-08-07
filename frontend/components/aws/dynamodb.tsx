import { FC, FormEvent, useContext, useEffect, useState } from 'react'
import { UserStore } from '../../contexts/user-provider'
import { buildClient, getItem } from '../../utils/aws/dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

export const DynamoComponent: FC = () => {
  const { user, authState } = useContext(UserStore)
  const [userClient, setUserClient] = useState<DynamoDBDocumentClient>()
  const [pk, setPk] = useState<string>('')
  const [item, setItem] = useState<Record<string, unknown>>()

  useEffect(() => {
    const dynamoClient = buildClient(user)

    setUserClient(dynamoClient)
  }, [user, authState])

  const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (userClient) {
      const item = await getItem(userClient, pk)
      setItem(item)
    }
  }

  return (
    <div
      style={{
        width: '100%',
      }}
    >
      <h1>Multi-tenant Dynamo</h1>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flexBasis: '0',
        }}
      >
        <div>
          <p>
            This dynamoDB client is secured to allow authenticated users to
            access resources, which belong to their organisation.
          </p>
          {user && (
            <p>
              Try querying your own tenant with the code:
              <a
                onClick={() =>
                  setPk(
                    user?.signInUserSession?.idToken?.payload?.['custom:org'] ||
                      ''
                  )
                }
              >
                {user.signInUserSession?.idToken.payload['custom:org']}#
              </a>
            </p>
          )}
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
                onChange={(e) => setPk(e.target.value)}
                size={40}
              />
            </label>
            <button type="submit">Get Item</button>
          </form>
        </div>
        <div>
          <pre
            style={{
              whiteSpace: 'pre-wrap',
            }}
          >
            {JSON.stringify(item, undefined, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}
