import * as AWS from 'aws-sdk';
import { PostConfirmationTriggerHandler  } from "aws-lambda";
import {v4 as uuidv4} from 'uuid';

const TENANT_KEY = 'custom:org'

const provider = new AWS.CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18'
});

/**
 * Set a UUID for all new sign ups which confirm.
 *
 * @param event
 */
export const postConfirmation: PostConfirmationTriggerHandler = async (event) => {
  const tenant_identifier = uuidv4()

  await provider.adminUpdateUserAttributes(
    {
      UserAttributes: [
        {
          Name: TENANT_KEY,
          Value: tenant_identifier
        }
      ],
      UserPoolId: event.userPoolId,
      Username: event.userName
    },
  ).promise()
}
