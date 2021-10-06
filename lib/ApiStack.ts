import { Effect, PolicyStatement } from '@aws-cdk/aws-iam'
import * as sst from '@serverless-stack/resources'
import { MultiStackProps } from '.'

export default class ApiStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props: MultiStackProps) {
    super(scope, id, props)

    const api = new sst.Api(this, 'API', {
      defaultAuthorizationType: sst.ApiAuthorizationType.AWS_IAM,
      routes: {
        'GET /': 'src/api.handler',
        'GET /{org}/test': 'src/api.handler',
      },
      cors: true,
    })

    /**
     * Policy that enables a tenant to access their entire organizations data.
     *
     * Entires in dynamoDB needs to begin with
     *
     */
    const tenantPolicy = new PolicyStatement({
      sid: 'AllowExecuteApiOnSpecificOrgRoute',
      effect: Effect.ALLOW,
      actions: ['execute-api:Invoke'],
      resources: [
        `arn:aws:execute-api:${this.region}:${this.account}:${api.httpApi.apiId}/$default/GET/\${aws:PrincipalTag/org}/*`,
      ],
    })

    props.auth && props.auth.attachPermissionsForAuthUsers([tenantPolicy])

    this.addOutputs({
      ApiUrl: api.url,
    })
  }
}
