import { Page } from "components/Layout/Page/Page"
import { SContainer } from "./XcmPage.styled"

import * as React from "react"
import * as Apps from "@galacticcouncil/apps"
import { createComponent } from "@lit-labs/react"
import { useAccountStore } from "state/store"
import { GcTransactionCenter } from "./TransactionCenter"

export const XcmApp = createComponent({
  tagName: "gc-xcm-app",
  elementClass: Apps.XcmApp,
  react: React,
})

export function XcmPage() {
  const { account } = useAccountStore()

  const ref = React.useRef<Apps.XcmApp>(null)
  return (
    <GcTransactionCenter>
      <Page>
        <SContainer>
          <XcmApp
            ref={ref}
            srcChain="kusama"
            dstChain="basilisk"
            chains="basilisk,karura,kusama,tinkernet,statemine,robonomics"
            accountName={account?.name}
            accountProvider={account?.provider}
            accountAddress={account?.address}
          />
        </SContainer>
      </Page>
    </GcTransactionCenter>
  )
}
