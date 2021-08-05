import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { NextPage } from 'next';
import { DynamoComponent } from '../components/aws/dynamodb';
import { DesignComponent } from '../components/design-component';


import {AuthStateApp} from '../components/auth-state-app'

const Home: NextPage = () => {
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
          <br />
          <div style={{
            display: "flex",
            flexDirection: "row",
            columnGap: "2em"
          }}>
            <DesignComponent/>
            <AuthStateApp />
          </div>
          <div style={{
            display: "flex",
            flexDirection: "row"
          }}>
            <DynamoComponent />
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
