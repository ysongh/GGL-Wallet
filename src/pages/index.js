import { useEffect, useState } from 'react';
import { Container, TabList, Tabs, TabPanels, TabPanel, Tab, Tooltip, Text, FormControl, FormLabel, Input, Card, CardBody, Button, useToast } from '@chakra-ui/react'
import { GaslessOnboarding } from "@gelatonetwork/gasless-onboarding";
import { ethers } from 'ethers'

import Navbar from '@/components/layout/Navbar';
import Token from '@/components/Token';
import QRcode from '@/components/QRcode';
import SpinnerLoad from '@/components/SpinnerLoad';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../contractdata'

export default function Home() {
  const toast = useToast()

  const [walletAddress, setWalletAddress] = useState();
  const [tokens, setTokens] = useState([]);
  const [showQRCode, setShowQRCode] = useState(false);
  const [url, setURL] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [gobMethod, setGOBMethod] = useState(null);
  const [gw, setGW] = useState();
  const [loading, setLoading] = useState(false);
  const [taskid, setTaskid] = useState("");

  useEffect(() => {
    login()
  }, [])

  const login = async () => {
    try{
      setLoading(true);
      const gaslessWalletConfig = { apiKey: process.env.NEXT_PUBLIC_GASLESSWALLET_KEY };
      const loginConfig = {
        domains: [window.location.origin],
        chain: {
          id: 5,
          rpcUrl: process.env.NEXT_PUBLIC_RPC,
        },
          openLogin: {
            redirectUrl: `https://ggl-wallet.netlify.app/`,
          },
  
      };
      const gaslessOnboarding = new GaslessOnboarding(
        loginConfig,
        gaslessWalletConfig
      );
      
      await gaslessOnboarding.init();
      const web3AuthProvider = await gaslessOnboarding.login();
      console.log("web3AuthProvider", web3AuthProvider);
      setGOBMethod(gaslessOnboarding);

      const gaslessWallet = gaslessOnboarding.getGaslessWallet();
      setGW(gaslessWallet);

      const address = gaslessWallet.getAddress()
      setWalletAddress(address)

      const result = await fetch(`https://api.covalenthq.com/v1/5/address/${address}/balances_v2/?key=${process.env.NEXT_PUBLIC_COVALENT_APIKEY}`);
      const balance = await result.json();

      setTokens(balance.data.items);
      setLoading(false);
    }
    catch(error){
      console.log(error)
      setLoading(false);
    }
  }

  const logout = async () => {
    await gobMethod.logout();
  }

  const mintNFT = async () => {
    try{
      let iface = new ethers.utils.Interface(CONTRACT_ABI);
      let x = iface.encodeFunctionData("mintImage", [ url, toAddress ])
      console.log(x)

      const { taskId } = await gw.sponsorTransaction(
        CONTRACT_ADDRESS,
        x,
      );

      console.log(taskId)
      setTaskid(taskId)
    } catch (error) {
      console.log(error)
    }
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);

    toast({
      title: 'Copied',
      position: 'top',
      status: 'success',
      duration: 5000,
      isClosable: true,
    })
  }

  return (
    <>
      <main>
        <Container maxW='500px'>
          <Card bgColor="#faf2f5" mt="5" height="600px">
            {loading
              ? <SpinnerLoad />
              : <CardBody>

                  <Navbar gobMethod={gobMethod} />
                  {walletAddress
                      && <Tooltip label={walletAddress}>
                          <Text textAlign="center" mt="5" mb="6" cursor="pointer" onClick={copyAddress}>
                            { walletAddress.slice(0, 5) + "..." + walletAddress.slice(37, 42)}
                          </Text>
                        </Tooltip>}

                  <Tabs variant='line'>
                    <TabList>
                      <Tab>Tokens</Tab>
                      <Tab onClick={() => setShowQRCode(true)}>Receive</Tab>
                      <Tab>Mint NFT</Tab>
                      <Tab>Setting</Tab>
                    </TabList>
                    <TabPanels mt="5">
                      <TabPanel>
                        {tokens.map(token => (
                          <Token key={token.contract_name} token={token} />
                        ))}
                      </TabPanel>

                      <TabPanel mt="5">
                        {showQRCode && <QRcode address={walletAddress} />}
                        {walletAddress && <Text textAlign="center" mt="4">{walletAddress}</Text>}
                      </TabPanel>

                      <TabPanel  mt="5">
                        <FormControl mb='3'>
                          <FormLabel htmlFor='URL'>URL</FormLabel>
                          <Input value={url} bgColor="white" onChange={(e) => setURL(e.target.value)} />
                        </FormControl>
                        <FormControl mb='3'>
                          <FormLabel htmlFor='URL'>To</FormLabel>
                          <Input value={toAddress}  bgColor="white" onChange={(e) => setToAddress(e.target.value)} />
                        </FormControl>
                        <Button bgColor="#b01a33" color="white" onClick={mintNFT} mt="3">
                          Free Mint
                        </Button>
                        <Text mt="2">{taskid}</Text>
                      </TabPanel>

                      <TabPanel mt="5">
                        <Button bgColor="#b01a33" color="white" onClick={logout}>
                          Logout
                        </Button>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </CardBody>
              }
          </Card>
        </Container>  
      </main>
    </>
  )
}
