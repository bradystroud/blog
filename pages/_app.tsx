import "../styles.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Space_Grotesk, Schibsted_Grotesk, JetBrains_Mono } from "next/font/google";

// Direction 1b — "Cool & Precise": Space Grotesk for display, Schibsted
// Grotesk for reading, JetBrains Mono for code/labels. See /design.
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const schibstedGrotesk = Schibsted_Grotesk({
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
      className={`${spaceGrotesk.variable} ${schibstedGrotesk.variable} ${jetbrainsMono.variable}`}
      style={{ fontFamily: schibstedGrotesk.style.fontFamily }}
    >
      <Component {...pageProps} />
      <Analytics />
      <SpeedInsights />
    </div>
  );
};

export default App;
