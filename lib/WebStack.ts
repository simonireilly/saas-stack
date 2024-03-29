import * as sst from '@serverless-stack/resources'
import { StaticSite } from '@serverless-stack/resources'
import { MultiStackProps } from '.'

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

    const nextJsSite = new StaticSite(this, 'NextJSSite', {
      path: 'src/frontend',
      buildCommand: 'yarn build',
      buildOutput: 'out',
      environment,
    })

    this.addOutputs({
      SiteUrl: nextJsSite.url,
    })
  }
}
