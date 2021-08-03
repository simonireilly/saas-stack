import '../styles/globals.css'
import '../styles/cognito.css'
import type { AppProps } from 'next/app'
import { Amplify } from 'aws-amplify'

const AuthConfiguration = {
  region: process.env.NEXT_PUBLIC_REGION,
  userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
  identityPoolId: process.env.NEXT_PUBLIC_IDENTITY_POOL_ID,
  userPoolWebClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID,
}

Amplify.configure({
  Auth: {
    ...AuthConfiguration,
  },
  ssr: true
})

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
export default MyApp
