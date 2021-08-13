import { APIGatewayProxyHandlerV2 } from 'aws-lambda'

export const handler: APIGatewayProxyHandlerV2 = async () => {
  return {
    body: JSON.stringify({
      data: 'success',
    }),
  }
}
