import { ChakraProvider } from '@chakra-ui/react'

import '@/styles/globals.css'
import Header from '@/components/Header';

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Header />
      <Component {...pageProps} />
    </ChakraProvider>
  )
}
