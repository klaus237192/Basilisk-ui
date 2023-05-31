import { useProviderRpcUrlStore } from "api/provider"
import { SCircle, SCircleDot, SItem } from "./ProviderItem.styled"
import { Text } from "components/Typography/Text/Text"
import { theme } from "theme"
import { InfoTooltip } from "components/InfoTooltip/InfoTooltip"
import { Icon } from "components/Icon/Icon"
import { ReactComponent as IconRemove } from "assets/icons/IconRemove.svg"
import { ReactComponent as IconEdit } from "assets/icons/IconEdit.svg"
import { useBestNumber } from "api/chain"
import { ProviderStatus } from "sections/provider/ProviderStatus"
import { useEffect, useState } from "react"
import { WsProvider } from "@polkadot/rpc-provider"
import { ApiPromise } from "@polkadot/api"
import { u32, u64 } from "@polkadot/types"
import { ProviderItemEdit } from "../ProviderItemEdit/ProviderItemEdit"

const ProviderItemExternal = (props: { url: string; className?: string }) => {
  const [bestNumberState, setBestNumberState] = useState<
    { relaychainBlockNumber: u32; timestamp: u64 } | undefined
  >(undefined)

  useEffect(() => {
    const rpc = props.url
    const provider = new WsProvider(rpc)

    let cancel: () => void

    async function load() {
      const api = await ApiPromise.create({ provider })

      async function onNewBlock() {
        const [relay, timestamp] = await Promise.all([
          api.query.parachainSystem.validationData(),
          api.query.timestamp.now(),
        ])

        setBestNumberState({
          relaychainBlockNumber: relay.unwrap().relayParentNumber,
          timestamp: timestamp,
        })
      }

      api.on("connected", onNewBlock)
      api.rpc.chain
        .subscribeNewHeads(onNewBlock)
        .then((newCancel) => (cancel = newCancel))
    }

    load()

    return () => {
      cancel?.()
      provider.disconnect()
    }
  }, [props.url])

  return (
    <>
      {bestNumberState != null ? (
        <ProviderStatus
          timestamp={bestNumberState.timestamp}
          relaychainBlockNumber={bestNumberState.relaychainBlockNumber}
          className={props.className}
          side="left"
        />
      ) : (
        <span className={props.className} />
      )}
    </>
  )
}

const ProviderItemLive = (props: { className?: string }) => {
  const number = useBestNumber()

  return (
    <>
      {number.data?.relaychainBlockNumber != null ? (
        <ProviderStatus
          timestamp={number.data.timestamp}
          relaychainBlockNumber={number.data?.relaychainBlockNumber}
          className={props.className}
          side="left"
        />
      ) : (
        <span className={props.className} />
      )}
    </>
  )
}

type ProviderItemprops = {
  name: string
  url: string
  isActive?: boolean
  custom?: boolean
  onClick: () => void
  onRemove?: (id: string) => void
}

export const ProviderItem = ({
  name,
  url,
  isActive,
  onClick,
  custom,
  onRemove,
}: ProviderItemprops) => {
  const [isEdit, setIsEdit] = useState(false)
  const store = useProviderRpcUrlStore()
  const rpcUrl = store.rpcUrl ?? import.meta.env.VITE_PROVIDER_URL

  const isLive = url === rpcUrl

  if (isEdit)
    return (
      <ProviderItemEdit
        name={name}
        url={url}
        onCancel={() => setIsEdit(false)}
      />
    )

  return (
    <SItem onClick={onClick}>
      <Text
        fs={14}
        color={isActive ? "primary400" : "white"}
        css={{
          gridArea: "name",
          transition: `all ${theme.transitions.default}`,
        }}
      >
        {name}
      </Text>
      {isLive ? (
        <ProviderItemLive css={{ gridArea: "status" }} />
      ) : (
        <ProviderItemExternal url={url} css={{ gridArea: "status" }} />
      )}
      <div
        css={{ gridArea: "url" }}
        sx={{
          textAlign: "right",
          flex: "row",
          align: "center",
          justify: "flex-end",
          gap: 16,
        }}
      >
        <Text
          fs={14}
          fw={500}
          tAlign="right"
          color={isActive ? "primary300" : "white"}
          sx={{ width: ["min-content", "auto"] }}
          css={{
            transition: `all ${theme.transitions.default}`,
          }}
        >
          {new URL(url).hostname}
        </Text>

        <SCircle>{isActive && <SCircleDot />}</SCircle>
        {custom && (
          <div sx={{ flex: "row", align: "center", gap: 12, ml: 8 }}>
            <InfoTooltip text="Remove">
              <Icon
                icon={<IconRemove />}
                sx={{ color: "neutralGray400" }}
                css={{ "&:hover": { opacity: 0.7 } }}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onRemove?.(url)
                }}
              />
            </InfoTooltip>
            <InfoTooltip text="Edit">
              <Icon
                icon={<IconEdit />}
                sx={{ color: "neutralGray400" }}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setIsEdit(true)
                }}
              />
            </InfoTooltip>
          </div>
        )}
      </div>
    </SItem>
  )
}
