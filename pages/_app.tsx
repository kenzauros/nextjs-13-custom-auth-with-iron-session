import fetchJson from "@/lib/fetchJson";
import type { AppProps } from "next/app";
import Head from "next/head";
import { SWRConfig } from "swr";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        fetcher: fetchJson,
        onError: (err: any) => {
          console.error(err);
        },
      }}
    >
      <Head>
        <title>Next.js Custom Auth with iron-session</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </SWRConfig>
  );
}
