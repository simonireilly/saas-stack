import { SignatureV4 } from '@aws-sdk/signature-v4'
import { Sha256 } from '@aws-crypto/sha256-js'
import { HttpRequest } from '@aws-sdk/protocol-http'
import { REGION } from './base'
import { cognitoCredentialProvider } from './cognito'
import * as aws4 from 'aws4'

const apiSigner = (idToken: string) =>
  new SignatureV4({
    region: REGION,
    credentials: cognitoCredentialProvider(idToken),
    service: 'execute-api',
    sha256: Sha256,
  })

export const awsApiGatewayRequest = async <T>(
  path: string,
  idToken: string
): Promise<T> => {
  const credentials = cognitoCredentialProvider(idToken)
  const creds = await credentials()
  console.info('Credentials', creds)

  const opts = {
    path,
    method: 'GET',
    hostname: '027zjwioj3.execute-api.eu-west-2.amazonaws.com',
    protocol: 'https',
    body: '',
    headers: {},
  }

  aws4.sign(opts, creds)

  console.info('Signed opts', opts)

  const signer = apiSigner(idToken)

  console.info('Signer', signer)

  const request = await signer.sign(
    new HttpRequest({
      path,
      method: 'GET',
      hostname: '027zjwioj3.execute-api.eu-west-2.amazonaws.com',
      protocol: 'https',
      body: '',
    })
  )

  console.info('Signed aws request', request)

  return fetch(
    `https://027zjwioj3.execute-api.eu-west-2.amazonaws.com${path}`,
    {
      headers: opts.headers,
    }
  ).then(async (response) => {
    console.info(response)
    const json = await response.json()
    console.info(json)
    return json
  })
}
