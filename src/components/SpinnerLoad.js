import { Box, Center, Heading, Spinner } from '@chakra-ui/react'

export default function SpinnerLoad() {
  return (
    <Box mt="100">
      <Heading textAlign="center" fontSize="5xl" mt="3">GGL Wallet</Heading>
      <Center>
        <Spinner
          size='xl'
          thickness='4px'
          textAlign="center"
          mt="10" />
      </Center>
    </Box>
    
  )
}
