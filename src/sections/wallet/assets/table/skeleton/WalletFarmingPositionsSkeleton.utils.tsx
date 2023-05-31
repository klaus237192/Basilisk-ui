import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { useTranslation } from "react-i18next"
import Skeleton from "react-loading-skeleton"
import { useMedia } from "react-use"
import { theme } from "theme"

export const useFarmingPositionsSkeleton = (enableAnimation = true) => {
  const { t } = useTranslation()
  const { display } = createColumnHelper()

  const isDesktop = useMedia(theme.viewport.gte.sm)
  const columnVisibility: VisibilityState = {
    symbol: true,
    date: isDesktop,
    shares: isDesktop,
    position: true,
  }

  const columns = [
    display({
      id: "name",
      header: t("wallet.assets.farmingPositions.header.name"),
      cell: () => (
        <div sx={{ flex: "row", gap: 8, height: [24, 32] }}>
          <div sx={{ width: [24, 32] }}>
            <Skeleton
              width="100%"
              height="100%"
              enableAnimation={enableAnimation}
            />
          </div>
          <Skeleton
            width={64}
            height="100%"
            enableAnimation={enableAnimation}
          />
        </div>
      ),
    }),
    display({
      id: "date",
      header: t("wallet.assets.farmingPositions.header.date"),
      cell: () => (
        <div>
          <Skeleton width={134} height={32} enableAnimation={enableAnimation} />
        </div>
      ),
    }),
    display({
      id: "shares",
      header: t("wallet.assets.farmingPositions.header.shares"),
      cell: () => (
        <div>
          <Skeleton width={134} height={32} enableAnimation={enableAnimation} />
        </div>
      ),
    }),
    display({
      id: "value",
      header: t("wallet.assets.farmingPositions.header.value"),
      cell: () => (
        <div sx={{ flex: "row", gap: 8, mr: 32, display: ["none", "flex"] }}>
          <Skeleton width={72} height={32} enableAnimation={enableAnimation} />
          <Skeleton width={72} height={32} enableAnimation={enableAnimation} />
          <Skeleton width={32} height={32} enableAnimation={enableAnimation} />
        </div>
      ),
    }),
  ]

  return useReactTable({
    data: mockData,
    columns,
    state: { columnVisibility },
    getCoreRowModel: getCoreRowModel(),
  })
}

const mockData = [1, 2, 3, 4]
