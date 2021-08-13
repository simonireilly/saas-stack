import { FC } from 'react'

export const DesignComponent: FC = () => (
  <div>
    <div>
      <article>
        <h2>Securing IAM for Multiple Tenants</h2>
        <section>
          <p>
            The goal is to secure a Tenant; client and server side, using IAM
            and fine grained access control
          </p>
          <p>
            Below describes how this achieved when new users sign up for an
            organisation
          </p>
        </section>
        <section>
          <div
            style={{
              overflowX: 'scroll',
              maxWidth: '90vw',
              scrollbarWidth: 'none',
              padding: '1rem',
            }}
          >
            <img
              src="/design.drawio.svg"
              alt="Design details"
              width="800"
              height="500"
            />
          </div>
        </section>
        <section>
          <p>
            In this scenario, PUBLIC and TENANT specific data can share a
            dynamoDB table.
          </p>
          <p>
            When the federated identity in step 6 is assumed, the IAM policy
            used, will secure the data with IAM.
          </p>
          <pre className="pre__responsive">
            {JSON.stringify(
              {
                Condition: {
                  'ForAllValues:StringLike': {
                    'dynamodb:LeadingKeys': ['${aws:PrincipalTag/org}#*'],
                  },
                },
                Action: ['dynamodb:GetItem', 'dynamodb:Query'],
                Resource:
                  'arn:aws:dynamodb:eu-west-2:322567890963:table/dev-saas-stack-DynamoDBTableResource',
                Effect: 'Allow',
                Sid: 'AllowPrecedingKeysToDynamoDBOrganisation',
              },
              undefined,
              2
            )}
          </pre>
        </section>
      </article>
    </div>
  </div>
)
