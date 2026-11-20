import {
  IoDesktopOutline,
  IoLaptopOutline,
  IoLocateOutline,
  IoPhonePortraitOutline,
  IoTabletPortraitOutline,
  IoTicketOutline,
} from 'react-icons/io5'

const productIcons = {
  iPhone: IoPhonePortraitOutline,
  iPad: IoTabletPortraitOutline,
  'Macbook Pro': IoLaptopOutline,
  iMac: IoDesktopOutline,
  AirTag: IoLocateOutline,
}

function ProductIcon({ product }) {
  const Icon = productIcons[product] || IoTicketOutline
  return <Icon aria-hidden='true' />
}

export default ProductIcon
