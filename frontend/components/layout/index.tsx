import Head from 'next/head'
import { FC } from 'react'
import styles from './Index.module.css'
import Link from 'next/link'

export const Layout: FC = ({ children }) => {
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
