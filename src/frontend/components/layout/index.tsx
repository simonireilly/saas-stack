import Head from 'next/head'
import { FC, useContext } from 'react'
import styles from './Index.module.css'
import Link from 'next/link'
import { AmplifySignOut } from '@aws-amplify/ui-react'
import { UserStore } from '../../contexts/user-provider'
import { AuthState } from '@aws-amplify/ui-components'

export const Layout: FC = ({ children }) => {
  const { authState } = useContext(UserStore)

  return (
    <div className={styles.container}>
      <Head>
        <title>Multi-tenant Cognito</title>
        <meta
          name="description"
          content="Example implementation of multi-tenancy"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <nav className={styles.navbar}>
          <Link passHref href="/">
            <div className={styles.navItem}>Home</div>
          </Link>
          <Link passHref href="/test">
            <div className={styles.navItem}>Test</div>
          </Link>
          {authState === AuthState.SignedIn ? (
            <AmplifySignOut />
          ) : (
            <Link passHref href="/auth">
              <div className={styles.navItem}>Sign in</div>
            </Link>
          )}
          <a
            href="https://github.com/simonireilly/saas-stack"
            target="_blank"
            rel="noreferrer"
          >
            Source code... <img src="/github.png" height="32" />
          </a>
        </nav>
      </header>

      <main className={styles.main}>
        <h1 className={styles.title}>Multi-tenant SaaS Stack</h1>
        {children}
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
