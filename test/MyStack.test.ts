import * as sst from '@serverless-stack/resources'
import { AuthStack } from '../lib/AuthStack'

test('Test Stack', () => {
  const app = new sst.App()
  // WHEN
  new AuthStack(app, 'test-stack')
})
