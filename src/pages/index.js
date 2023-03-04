import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'

import {
  GaslessOnboarding,
  GaslessWalletConfig,
  GaslessWalletInterface,
  LoginConfig,
} from "@gelatonetwork/gasless-onboarding";

export default function Home() {
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
        <button onClick={login}>login</button>    
      </main>
    </>
  )
}
