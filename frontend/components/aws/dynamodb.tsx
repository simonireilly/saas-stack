import { FC, FormEvent, useContext, useEffect, useState } from 'react'
import { UserStore } from '../../contexts/user-provider'
import { buildClient, getItem } from '../../utils/aws/dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

export const DynamoComponent: FC<{ initialPk: string }> = ({ initialPk }) => {
  const { user, authState } = useContext(UserStore)
  const [userClient, setUserClient] = useState<DynamoDBDocumentClient>()
  const [pk, setPk] = useState<string>(initialPk)
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
    <>
      <div>
        <form onSubmit={handleOnSubmit}>
          <h3>Get item:</h3>
          <label>
            Primary Key:{' '}
            <input
              type="text"
              value={pk}
              onChange={(e) => setPk(e.target.value)}
              size={30}
            />
          </label>
          <button type="submit">Get Item</button>
        </form>
      </div>
      <div>
        {item && (
          <pre className="pre__responsive">
            {JSON.stringify(item, undefined, 2)}
          </pre>
        )}
      </div>
    </>
  )
}
