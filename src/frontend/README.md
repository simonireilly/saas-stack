# Frontend

- [Frontend](#frontend)
  - [Goals](#goals)
  - [Amplify Auth Config](#amplify-auth-config)
  - [Dependencies](#dependencies)

## Goals

- [x] Implement cognito auth, with required org
- [ ] Show policies in play for client side fetching based on
  - [ ] Public
  - [ ] User
  - [ ] Org

## Amplify Auth Config

Setup using environment variables

Install the UI library and configure: https://docs.amplify.aws/ui/auth/authenticator/q/framework/react#basic-usage

## Dependencies

```bash
yarn add --dev @aws-sdk/lib-dynamodb \
  @aws-sdk/client-cognito-identity \
  @aws-sdk/client-dynamodb \
  @aws-sdk/credential-provider-cognito-identity
```
