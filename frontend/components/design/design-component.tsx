import { FC } from 'react'
import Image from 'next/image'

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
      </article>
    </div>
    <Image
      src="/design.drawio.svg"
      alt="Design details"
      width="800"
      height="500"
    />
  </div>
)
