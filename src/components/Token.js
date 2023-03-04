import { Card, Text } from '@chakra-ui/react'

export default function Token({ token }) {
  return (
    <Card
      direction={{ base: 'column', sm: 'row' }}
      overflow='hidden'
    >
      <img
        width="75px"
        src={token.logo_url}
        alt='Token'
      />
    
      <Text fontSize="xl" mt="5">
        {token.balance / 10 ** token.contract_decimals} {token.contract_ticker_symbol}
      </Text>
    </Card>
  )
}
