import * as sst from '@serverless-stack/resources'
import { MultiStackProps } from '.'

export default class ApiStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props: MultiStackProps) {
    super(scope, id, props)

    const api = new sst.Api(this, 'API', {
      defaultAuthorizationType: sst.ApiAuthorizationType.AWS_IAM,
      routes: {
        'GET /': 'src/api.handler',
      },
      cors: true,
    })

    props.auth && props.auth.attachPermissionsForAuthUsers([api])

    this.addOutputs({
      ApiUrl: api.url,
    })
  }
}
