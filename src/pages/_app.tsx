import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import "@uploadthing/react/styles.css" // <-- must before "~/styles/globals.css"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { type Session } from "next-auth"
import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "next-themes"
import { type AppType } from "next/app"
import "react-phone-number-input/style.css"
import "~/styles/globals.css"
import { Toaster } from "~/ui/toaster"
import { api } from "~/utils/api"

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SessionProvider session={session}>
          <Analytics />
          <Component {...pageProps} />
          <SpeedInsights />
          <Toaster />
        </SessionProvider>
      </ThemeProvider>
      {process.env.NODE_ENV !== "production" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </>
  )
}

export default api.withTRPC(MyApp)
