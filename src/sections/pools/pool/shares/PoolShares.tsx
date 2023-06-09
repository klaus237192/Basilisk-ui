import { PoolBase } from "@galacticcouncil/sdk"
import { useTokenBalance } from "api/balances"
import { useAccountDepositIds, useDeposits } from "api/deposits"
import { usePoolShareToken } from "api/pools"
import { GradientText } from "components/Typography/GradientText/GradientText"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { PoolSharesDeposit } from "sections/pools/pool/shares/deposit/PoolSharesDeposit"
import {
  SContainer,
  SDetails,
} from "sections/pools/pool/shares/PoolShares.styled"
import { PoolSharesUnstaked } from "sections/pools/pool/shares/unstaked/PoolSharesUnstaked"
import { PoolSharesValue } from "sections/pools/pool/shares/value/PoolSharesValue"
import { useAccountStore } from "state/store"

type Props = { pool: PoolBase }

export const PoolShares: FC<Props> = ({ pool }) => {
  const { t } = useTranslation()

  const { account } = useAccountStore()

  const shareToken = usePoolShareToken(pool.address)
  const balance = useTokenBalance(shareToken.data?.token, account?.address)

  const deposits = useDeposits(pool.address)
  const accountDepositIds = useAccountDepositIds(account?.address)
  const depositNftList = deposits.data?.filter((deposit) =>
    accountDepositIds.data?.some((ad) => ad.instanceId.eq(deposit.id)),
  )

  return (
    <SContainer>
      <GradientText fs={16} lh={22} fw={500} sx={{ mb: 12 }}>
        {t("pools.pool.liquidity.title")}
      </GradientText>
      <SDetails>
        <PoolSharesUnstaked balance={balance.data?.balance} />
        <PoolSharesValue
          shareToken={shareToken.data?.token}
          pool={pool}
          shareTokenBalance={balance.data?.balance}
        />
      </SDetails>
      {!!depositNftList?.length && (
        <div sx={{ flex: "column", gap: 12, mt: 32 }}>
          {depositNftList.map((nft, i) => (
            <PoolSharesDeposit
              key={nft.id.toString()}
              index={i + 1}
              pool={pool}
              depositNft={nft}
            />
          ))}
        </div>
      )}
    </SContainer>
  )
}
