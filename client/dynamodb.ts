import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const REGION = 'us-east-1'
const identityPoolId = 'us-east-1:b1799846-b537-4ec6-9892-79cd8404c9d3'
const accountId = '322567890963'
const TableName = 'dev-saas-stack-DynamoDBTableResource'

// Set the default credentials.
const cognitoCredentialProvider = fromCognitoIdentityPool({
    client: new CognitoIdentityClient({
        region: REGION,
    }),
    identityPoolId,
    accountId
})

const client = new DynamoDBClient({
    credentials: cognitoCredentialProvider,
    region: REGION
});

const ddbDocClient = DynamoDBDocumentClient.from(client);

const putItem = async (pk: string) => {
    try {
        await ddbDocClient.send(new PutCommand({
            TableName,
            Item: {
                pk,
                sk: 'allowed'
            }
        }))
        console.info('Passing Public pk', { pk })
    } catch (e) {
        console.error('Failing pk', { pk })
    }
}

putItem('PUBLIC#1234-412412')
putItem('PUBLIC#1')
putItem('MYPUBLIC#1')
