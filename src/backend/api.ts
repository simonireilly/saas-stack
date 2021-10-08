import { APIGatewayProxyHandlerV2 } from 'aws-lambda'

export const handler: APIGatewayProxyHandlerV2 = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      data: 'success',
    }),
  }
}
