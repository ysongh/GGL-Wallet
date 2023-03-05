import { Box, Select } from '@chakra-ui/react'

export default function Navbar() {
  return (
    <Box mt="6">
      <center>
        <Select size='lg' width="250px">
          <option value='option1'>Polygon Mumbai</option>
        </Select>
      </center>
    </Box>
  )
}
