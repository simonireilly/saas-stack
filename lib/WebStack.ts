import * as sst from '@serverless-stack/resources'
import { VercelSecretSyncConstruct } from '@cdk-utils/vercel-secret-forwarder'
import { MultiStackProps } from '.'

/**
 * Moved preview builds to vercel, so teh web stack just forwards the secrets to
 * the configured preview environment now
 */
export class WebStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props: MultiStackProps) {
    super(scope, id, props)

    const environment = {
      NEXT_PUBLIC_IDENTITY_POOL_ID:
        props?.auth?.cognitoCfnIdentityPool.ref || '',
      NEXT_PUBLIC_REGION: this.region,
      NEXT_PUBLIC_USER_POOL_CLIENT_ID:
        props?.auth?.cognitoUserPoolClient?.userPoolClientId || '',
      NEXT_PUBLIC_USER_POOL_ID: props?.auth?.cognitoUserPool?.userPoolId || '',
      NEXT_PUBLIC_MULTI_TENANT_TABLE_NAME: props.table?.tableName || '',
      NEXT_PUBLIC_API_URL: props.api?.url || '',
    }

    const vercel = new VercelSecretSyncConstruct(
      this,
      'SendSecretsToVercelPreviews',
      {
        GitBranch: 'vercel-deploys',
        VercelProjectName: 'saas-stack',
        VercelProjectId: String(process.env.VERCEL_PROJECT_ID),
        VercelProjectOrganisation: String(process.env.VERCEL_ORGANISATION_ID),
        VercelAuthToken: String(process.env.VERCEL_API_TOKEN),
        VercelEnvironmentVariables: environment,
      }
    )
  }
}
