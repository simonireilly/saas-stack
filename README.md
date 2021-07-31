# Identity Attributes

Creating a construct for Cognito SaaS Multi-tenancy when using Federated Access.

- [Identity Attributes](#identity-attributes)
  - [To Do](#to-do)
  - [Reading](#reading)

## To Do

- [x] Create custom resource that sets principal identity attributes on the federated identities.
- [x] Create policies which use in fine-grained access control.
- [ ] Setup site for cognito authentication:
  - [ ] https://serverless-stack.com/chapters/using-cognito-to-add-authentication-to-a-serverless-app.html
- [ ] Demonstrate solutions for:
  - [ ] Public information
  - [ ] Private information shared by many users in the tenant
  - [ ] Private information, belonging only to that tenant

Plan to build polices that can be used with federated identities, and are still scoped specifically to tenant features.

## Reading

Check out this cool video by AWS demonstrating how to set this up in the console. https://www.youtube.com/watch?v=tAUmz94O2Qo

Then we can authenticate with this guide (https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/loading-browser-credentials-cognito.html) to test the IAM roles assumed by the identities.

String operators that work for us: https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_condition_operators.html#Conditions_String
