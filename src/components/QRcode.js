import { useEffect, useState } from 'react';
import { Center, Text } from '@chakra-ui/react'
import QRCode from 'qrcode';

export default function Token({ address }) {
  const [qr, setQR] = useState(null);

  useEffect(() => {
    QRCode.toDataURL(address).then(data => {
      setQR(data)
    })
  }, [])
  

  return (
    <Center>
      <img src={qr} />
    </Center>
  )
}
