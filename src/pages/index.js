import { useState } from 'react';
import Head from 'next/head'
import { Container, Heading, Text, Divider, Card, CardBody, Button } from '@chakra-ui/react'

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
      <main>
        <Container maxW='550px'>
          <Card>
            <CardBody>
              <Heading textAlign="center" mt="3" mb="5">GGL-Wallet</Heading>
              {walletAddress && <Text textAlign="center">{walletAddress}</Text>}
              <Divider mt="4" />
              {tokens.map(token => (
                <Card
                  key={token.contract_name}
                  direction={{ base: 'column', sm: 'row' }}
                  overflow='hidden'
                >
                  <img
                    width="75px"
                    src={token.logo_url}
                    alt='Caffe Latte'
                  />
                
                  <Text fontSize="xl" mt="5">
                    {token.balance / 10 ** token.contract_decimals} {token.contract_ticker_symbol}
                  </Text>
                </Card>
              ))}
              {!walletAddress && <Button onClick={login}>login</Button>}
            </CardBody>
          </Card>
        </Container>  
      </main>
    </>
  )
}
