import '../styles/globals.css'
import '../styles/cognito.css'
import type { AppProps } from 'next/app'
import { Amplify } from 'aws-amplify'
import { UserContextProvider } from '../contexts/user-provider'
import { Layout } from '../components/layout'

const AuthConfiguration = {
  region: process.env.NEXT_PUBLIC_REGION,
  userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
  identityPoolId: process.env.NEXT_PUBLIC_IDENTITY_POOL_ID,
  userPoolWebClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID,
}

try {
  // Next build will evaluate this; we only want this in the browser
  Amplify.configure({
    Auth: AuthConfiguration,
  })
} catch (e) {
  console.error(e.message)
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserContextProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserContextProvider>
  )
}
export default MyApp
