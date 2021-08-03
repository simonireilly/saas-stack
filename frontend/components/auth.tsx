import { AmplifyAuthContainer, AmplifyAuthenticator, AmplifySignIn, AmplifySignOut, AmplifySignUp } from "@aws-amplify/ui-react"
import { FC } from "react"

export const AuthComponent: FC = () => {
  return <AmplifyAuthContainer>
    <AmplifyAuthenticator usernameAlias="email">
      <AmplifySignUp
        slot="sign-up"
        usernameAlias="email"
        headerText="Create a new tenant"
        formFields={[
          {
            type: "email",
            label: "Custom Email Label",
            placeholder: "Custom email placeholder",
            inputProps: { required: true, autocomplete: "username" },
          },
          {
            type: "password",
            label: "Custom Password Label",
            placeholder: "Custom password placeholder",
            inputProps: { required: true, autocomplete: "new-password" },
          },
          {
            type: "phone_number",
            label: "Custom Phone Label",
            placeholder: "Custom phone placeholder",
          },
        ]}
      />
      <AmplifySignIn slot="sign-in" usernameAlias="email" headerText="Sign in to tenant" />
      <AmplifySignOut />
    </AmplifyAuthenticator>
  </AmplifyAuthContainer>
}
