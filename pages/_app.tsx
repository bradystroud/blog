import "../styles.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Fraunces, Instrument_Sans, JetBrains_Mono } from "next/font/google";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["opsz", "SOFT"],
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const App = ({ Component, pageProps }) => {
  return (
    <div
      className={`${fraunces.variable} ${instrumentSans.variable} ${jetbrainsMono.variable}`}
      style={{ fontFamily: instrumentSans.style.fontFamily }}
    >
      <Component {...pageProps} />
      <Analytics />
      <SpeedInsights />
    </div>
  );
};

export default App;
