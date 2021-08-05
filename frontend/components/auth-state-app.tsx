import { AuthState, onAuthUIStateChange } from "@aws-amplify/ui-components";
import { AmplifyAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import { FC, useContext, useEffect } from "react";
import { UserStore, User } from "../contexts/user-provider";



export const AuthStateApp: FC = () => {
  const {setAuthState, setUser, user, authState} = useContext(UserStore)

  useEffect(() => {
      return onAuthUIStateChange((nextAuthState, authData) => {
          setAuthState?.(nextAuthState);
          const userData = authData as User
          setUser?.(userData)
      });
  }, []);



  return authState === AuthState.SignedIn && user ? (
    <div className="App">
        <div>Hello, {user.username}</div>
        <AmplifySignOut />
    </div>
  ) : (
    <AmplifyAuthenticator />
  );
}
