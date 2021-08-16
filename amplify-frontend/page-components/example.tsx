import { FC, useContext } from 'react'
import styles from './Example.module.css'
import { AuthStateApp } from '../components/amplify/auth-state-app'
import { DynamoComponent } from '../components/aws/dynamodb'
import { UserStore } from '../contexts/user-provider'
import { ApiGatewayComponent } from '../components/aws/api-gateway'

export const Example: FC = () => {
  const { user } = useContext(UserStore)

  return (
    <div className={styles.split}>
      <ApiGatewayComponent />
      <div className={styles.splitItem}>
        <AuthStateApp />
      </div>
      <div className={styles.splitItem}>
        <div className={styles.drop}>
          <div>
            <h3>Public Example</h3>
            <p>
              Read anything from dynamoDB that begins with{' '}
              <code className={styles.code}>PUBLIC#</code>
            </p>
            <DynamoComponent initialPk={'PUBLIC#1'} />
          </div>
          <div>
            <h3>Tenant Example</h3>
            <p>
              Fetch anything that is public
              <code className={styles.code}>PUBLIC#</code>, and also anything
              that begins with your own tenants unique ID.
            </p>
            {user?.signInUserSession ? (
              <DynamoComponent
                initialPk={`${user?.signInUserSession?.idToken.payload['custom:org']}#1`}
              />
            ) : (
              <p>Sign in to access this</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
