import { AppProviders } from "components/AppProviders/AppProviders"
import {
  createBrowserHistory,
  ReactLocation,
  Router,
} from "@tanstack/react-location"
import { routes } from "./routes"
import { TestnetModal } from "sections/testnet/TestnetModal"

const history = createBrowserHistory()
const location = new ReactLocation({ history })

export const App = () => {
  return (
    <AppProviders>
      <Router location={location} routes={routes} />
      {import.meta.env.VITE_SENTRY_DSN && (
        <TestnetModal
          onBack={() => (window.location.href = "https://bsx.fi/")}
        />
      )}
    </AppProviders>
  )
}
