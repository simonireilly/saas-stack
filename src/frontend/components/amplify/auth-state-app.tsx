import { FC, useContext } from 'react'
import { UserStore, User } from '../../contexts/user-provider'

export const AuthStateApp: FC = () => {
  const { user } = useContext(UserStore)

  const loggedInFragment = (user: User) => (
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
    </div>
  )

  return (
    <div>
      <h2>Multi-tenant Features</h2>
      {user ? (
        loggedInFragment(user)
      ) : (
        <div>
          <p>Sign in to access these features</p>
        </div>
      )}
    </div>
  )
}
