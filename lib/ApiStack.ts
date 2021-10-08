import { Effect, PolicyStatement } from '@aws-cdk/aws-iam'
import * as sst from '@serverless-stack/resources'
import { MultiStackProps } from '.'

export class ApiStack extends sst.Stack {
  readonly api: sst.Api

  constructor(scope: sst.App, id: string, props: MultiStackProps) {
    super(scope, id, props)

    this.api = new sst.Api(this, 'API', {
      defaultAuthorizationType: sst.ApiAuthorizationType.AWS_IAM,
      routes: {
        'GET /{org}/test': 'src/backend/api.handler',
      },
      cors: true,
    })

    /**
     * Policy that enables a tenant to access their entire organizations data.
     *
     * Once a user has an org ID, they can access those urls that have their org
     * associated, but no other urls.
     *
     * This assumes we are building an API like:
     *
     * /a485d3c7-99aa-45b5-971e-a510ea158c1e/projects/1
     *
     */
    const tenantPolicy = new PolicyStatement({
      sid: 'AllowExecuteApiOnSpecificOrgRoute',
      effect: Effect.ALLOW,
      actions: ['execute-api:Invoke'],
      resources: [
        `arn:aws:execute-api:${this.region}:${this.account}:${this.api.httpApi.apiId}/$default/GET/\${aws:PrincipalTag/org}/*`,
      ],
    })

    props.auth && props.auth.attachPermissionsForAuthUsers([tenantPolicy])

    this.addOutputs({
      ApiUrl: this.api.url,
    })
  }
}
