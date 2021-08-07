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

  console.info(user)

  return authState === AuthState.SignedIn && user ? (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
      }}
    >
      <div>Hello, {user?.attributes?.email}</div>
      <AmplifySignOut />
    </div>
  ) : (
    <AmplifyAuthenticator />
  )
}
