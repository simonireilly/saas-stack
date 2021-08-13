import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components'
import { AmplifyAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'
import { FC, useContext, useEffect } from 'react'
import { UserStore, User } from '../../contexts/user-provider'

export const AuthStateApp: FC = () => {
  const { setAuthState, setUser, user, authState } = useContext(UserStore)

  useEffect(() => {
    return onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState?.(nextAuthState)
      const userData = authData as User
      setUser?.(userData)
    })
  }, [setAuthState, setUser])

  return authState === AuthState.SignedIn && user ? (
    <div>
      <div>
        <p>Hello, {user?.attributes?.email}</p>
        <p>Thanks for signing up 👍</p>
        <p>
          Below, you can see you JWT identity token claims, Amplify will take
          these and substitute in your <code>custom:org</code> to secure your
          data while you are on this site
        </p>
        <pre className="pre__responsive">
          {JSON.stringify(
            user.signInUserSession?.idToken.payload,
            undefined,
            2
          )}
        </pre>
      </div>
      <AmplifySignOut />
    </div>
  ) : (
    <AmplifyAuthenticator />
  )
}
