import { useQueryClient } from "@tanstack/react-query"
import { ReactNode, useEffect } from "react"
import { useApiPromise } from "utils/api"
import { isApiLoaded } from "utils/helpers"
import { QUERY_KEY_PREFIX } from "utils/queryKeys"

export const InvalidateOnBlock = (props: { children: ReactNode }) => {
  const api = useApiPromise()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (isApiLoaded(api)) {
      let cancel: () => void

      api.rpc.chain
        .subscribeNewHeads(() => {
          queryClient.invalidateQueries([QUERY_KEY_PREFIX])
        })
        .then((newCancel) => (cancel = newCancel))

      return () => cancel?.()
    }
  }, [api, queryClient])

  return <>{props.children}</>
}
