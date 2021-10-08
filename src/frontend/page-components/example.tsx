import { FC, useContext } from 'react'
import styles from './Example.module.css'
import { AuthStateApp } from '../components/amplify/auth-state-app'
import { DynamoComponent } from '../components/aws/dynamodb'
import { UserStore } from '../contexts/user-provider'
import { ApiGatewayComponent } from '../components/aws/api-gateway'

export const Example: FC = () => {
  const { user } = useContext(UserStore)
  const org = user?.signInUserSession?.idToken.payload['custom:org']

  return (
    <div className={styles.split}>
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
              <DynamoComponent initialPk={`${org}#1`} />
            ) : (
              <p>Sign in to access this</p>
            )}
          </div>
        </div>
        <div className={styles.drop}>
          <div>
            <h3>Api Gateway Example</h3>
            <p>
              The API Gateway IAM role is setup to only allow fetching on URLs
              that match the format {`GET /${org}/*`}.{' '}
            </p>
            <p>
              To test this out, you can change the below, and it will show you
              the request being made to API Gateway.
            </p>
            {user?.signInUserSession ? (
              <ApiGatewayComponent initialApiUrl={org} />
            ) : (
              <p>Sign in to access this</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
