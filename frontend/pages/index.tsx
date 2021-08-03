import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { AuthComponent } from '../components/auth';
import { Auth } from 'aws-amplify'
import { DynamoComponent } from '../components/aws/dynamodb';
import { DesignComponent } from '../components/design-component';

const Home: NextPage = () => {
  const [idToken, setIdToken] = useState<string | undefined>()

  useEffect(() => {
    const authCheck = async () => {
      const cognitoSession = await Auth.currentSession()
      console.info('Session', cognitoSession)
      const idToken = await cognitoSession.getIdToken()
      setIdToken(idToken.getJwtToken())
    }

    authCheck()
  }, []);

  return (
    <div className={styles.container}>
        <Head>
          <title>Multi-tenant Cognito</title>
          <meta name="description" content="Example implementation of multi-tenancy" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <h1 className={styles.title}>
            Multi-tenant SaaS Stack
          </h1>
          <hr />
          <div style={{
            display: "flex",
            flexDirection: "row",
            columnGap: "2em"
          }}>
            <DesignComponent/>
            <AuthComponent/>
          </div>
          <div style={{
            display: "flex",
            flexDirection: "row"
          }}>
              <DynamoComponent idToken={idToken} />
          </div>
        </main>

        <footer className={styles.footer}>
          <a
            href="https://github.com/simonireilly"
            target="_blank"
            rel="noopener noreferrer"
            >
            Created by Simon
          </a>
        </footer>
      </div>
  )
}

export default Home
