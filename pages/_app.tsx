import "../styles.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SessionProvider } from "next-auth/react";

const App = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
      <Analytics />
      <SpeedInsights />
    </SessionProvider>
  );
};

export default App;
