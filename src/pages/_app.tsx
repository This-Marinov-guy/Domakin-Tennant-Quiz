import type { AppProps } from "next/app";
import Head from "next/head";

import "../styles/index.scss";
import HeaderOne from "@/layouts/headers/HeaderOne";
import FooterFour from "@/layouts/footers/FooterFour";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Domakin Tennat Quiz</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0D1A1C" />
      </Head>
      <HeaderOne />
      <Component {...pageProps} />
      <FooterFour />
    </>
  );
}
