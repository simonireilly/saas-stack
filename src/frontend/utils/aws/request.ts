import { cognitoCredentialProvider } from './cognito'
import * as aws4 from 'aws4'

export const awsApiGatewayRequest = async <T>(
  path: string,
  idToken: string
): Promise<T> => {
  const url = new URL(String(process.env.NEXT_PUBLIC_API_URL))

  // TODO: Getting temporary credentials for every API call should not be
  // necessary. We should get from cache or refresh.
  //
  // Potentially just use Amplify API support to avoid this stuff.
  const credentials = cognitoCredentialProvider(idToken)
  const creds = await credentials()

  const opts = {
    path,
    method: 'GET',
    hostname: url.host,
    protocol: url.protocol,
    body: '',
    headers: {},
  }

  aws4.sign(opts, creds)

  return fetch(`${url.origin}${path}`, {
    headers: opts.headers,
  }).then(async (response) => {
    const json = await response.json()
    return json
  })
}
