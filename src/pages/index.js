import { useState } from 'react';
import Head from 'next/head'
import styles from '@/styles/Home.module.css'

import {
  GaslessOnboarding,
  GaslessWalletConfig,
  GaslessWalletInterface,
  LoginConfig,
} from "@gelatonetwork/gasless-onboarding";

export default function Home() {
  const [walletAddress, setWalletAddress] = useState();
  const [tokens, setTokens] = useState([]);

  const login = async () => {
    try{
      const gaslessWalletConfig = process.env.NEXT_PUBLIC_GASLESSWALLET_KEY;
      const loginConfig = {
        domains: ["http://localhost:3000/"],
        chain: {
          id: 80001,
          rpcUrl: "https://rpc-mumbai.maticvigil.com/",
        },
          openLogin: {
            redirectUrl: `http://localhost:3000/`,
          },
  
      };
      const gaslessOnboarding = new GaslessOnboarding(
        loginConfig,
        gaslessWalletConfig
      );
      
      await gaslessOnboarding.init();
      const web3AuthProvider = await gaslessOnboarding.login();
      console.log("web3AuthProvider", web3AuthProvider)

      const gaslessWallet = gaslessOnboarding.getGaslessWallet()
      const address = gaslessWallet.getAddress()
      setWalletAddress(address)

      const result = await fetch(`https://api.covalenthq.com/v1/80001/address/${address}/balances_v2/?key=${process.env.NEXT_PUBLIC_COVALENT_APIKEY}`);
      const balance = await result.json();

      setTokens(balance.data.items);
    }
    catch(error){
      console.log(error)
    }
  }

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1>GGL-Wallet</h1>
        {walletAddress && <p>{walletAddress}</p>}
        <h2>Your Balance</h2>
        {tokens.map(token => (
          <div key={token.contract_name}>
            <img src={token.logo_url} alt="token" />
            <p>{token.balance / 10 ** token.contract_decimals} {token.contract_ticker_symbol}</p>
          </div>
        ))}
        <button onClick={login}>login</button>    
      </main>
    </>
  )
}
