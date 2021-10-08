import { FC, FormEvent, useContext, useState } from 'react'
import { UserStore } from '../../contexts/user-provider'
import { awsApiGatewayRequest } from '../../utils/aws/request'

export const ApiGatewayComponent: FC<{ initialApiUrl?: string }> = ({
  initialApiUrl = 'public',
}) => {
  const { user } = useContext(UserStore)
  const [response, setResponse] = useState<unknown>()
  const [apiUrl, setApiUrl] = useState<string>(initialApiUrl)

  const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const res = await awsApiGatewayRequest<{ data: 'success' }>(
      `/${apiUrl}/test` || '/',
      user?.signInUserSession?.idToken.jwtToken || ''
    )

    setResponse(res)
  }

  return (
    <div>
      <form onSubmit={handleOnSubmit}>
        <label>
          Api URl:{' '}
          <input
            type="text"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            size={30}
          />
        </label>
        <button type="submit">Make request</button>
      </form>
      {response && (
        <pre className="pre__responsive">
          {JSON.stringify(response, undefined, 2)}
        </pre>
      )}
    </div>
  )
}
