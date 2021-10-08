import * as sst from '@serverless-stack/resources'
import { AuthStack } from './AuthStack'
import { DataStack } from './DataStack'
import { WebStack } from './WebStack'
import { ApiStack } from './ApiStack'

export interface MultiStackProps extends sst.StackProps {
  auth?: sst.Auth
  table?: sst.Table
  api?: sst.Api
}

export default function main(app: sst.App): void {
  app.setDefaultFunctionProps({
    runtime: 'nodejs14.x',
  })

  const authStack = new AuthStack(app, 'AuthStack')

  const dataStack = new DataStack(app, 'DataStack', {
    auth: authStack.auth,
  })

  const apiStack = new ApiStack(app, 'ApiStack', {
    table: dataStack.table,
    auth: authStack.auth,
  })

  new WebStack(app, 'WebStack', {
    table: dataStack.table,
    auth: authStack.auth,
    api: apiStack.api,
  })
}
