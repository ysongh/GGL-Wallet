import Head from "next/head";

export default function Header() {
  return (
    <Head>
      <title>GGL Wallet</title>
      <meta name="description" content="A browser-based wallet with social logins and passwordless onboarding" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  )
}