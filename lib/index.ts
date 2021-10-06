import { AuthStack } from './AuthStack'
import * as sst from '@serverless-stack/resources'
import DataStack from './DataStack'
import WebStack from './WebStack'
import ApiStack from './ApiStack'

export interface MultiStackProps extends sst.StackProps {
  auth?: sst.Auth
  table?: sst.Table
}

export default function main(app: sst.App): void {
  // Set default runtime for all functions
  app.setDefaultFunctionProps({
    runtime: 'nodejs12.x',
  })

  const authStack = new AuthStack(app, 'AuthStack')
  const dataStack = new DataStack(app, 'DataStack', {
    auth: authStack.auth,
  })

  new WebStack(app, 'WebStack', {
    table: dataStack.table,
    auth: authStack.auth,
  })

  new ApiStack(app, 'ApiStack', {
    table: dataStack.table,
    auth: authStack.auth,
  })
}
