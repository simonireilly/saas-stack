import * as sst from '@serverless-stack/resources'
import MyStack from '../lib/ApiStack'

test('Test Stack', () => {
  const app = new sst.App()
  // WHEN
  new MyStack(app, 'test-stack')
})
