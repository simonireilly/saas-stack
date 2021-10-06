import { AuthState } from '@aws-amplify/ui-components'
import {
  createContext,
  Dispatch,
  ReactElement,
  SetStateAction,
  useState,
} from 'react'

export type User = {
  username?: string
  email?: string
  attributes?: {
    [key: string]: string
  }
  signInUserSession?: {
    idToken: {
      jwtToken: string
      payload: {
        [key: string]: string
      }
    }
  }
}

interface Props {
  children: ReactElement
  value?: UserContext
}

export type UserContext = {
  authState?: AuthState
  setAuthState?: Dispatch<SetStateAction<AuthState>>
  user?: User
  setUser?: Dispatch<SetStateAction<User>>
}

export const UserStore = createContext<UserContext>({
  authState: AuthState.SignedOut,
})

export const UserContextProvider = (props: Props): ReactElement => {
  const [authState, setAuthState] = useState<AuthState>(AuthState.SignedOut)
  const [user, setUser] = useState<User>({})

  console.info('Current User', { user })

  return (
    <UserStore.Provider
      value={{
        authState,
        setAuthState,
        user,
        setUser,
      }}
    >
      {props.children}
    </UserStore.Provider>
  )
}
