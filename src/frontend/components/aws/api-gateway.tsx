import { FC, FormEvent, useContext, useState } from 'react'
import { UserStore } from '../../contexts/user-provider'
import { awsApiGatewayRequest } from '../../utils/aws/request'

export const ApiGatewayComponent: FC = () => {
  const { user } = useContext(UserStore)
  const [response, setResponse] = useState<unknown>()

  const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const res = await awsApiGatewayRequest<{ data: 'success' }>(
      `/${user?.signInUserSession?.idToken.payload['custom:org']}/test` || '/',
      user?.signInUserSession?.idToken.jwtToken || ''
    )

    setResponse(res)
  }

  return (
    <div>
      <form onSubmit={handleOnSubmit}>
        <button type="submit">Make request</button>
      </form>
      <pre className="pre__responsive">
        {JSON.stringify(response, undefined, 2)}
      </pre>
    </div>
  )
}