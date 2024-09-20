/* eslint-disable no-shadow */
/* eslint-disable no-else-return */
/* eslint-disable import/no-anonymous-default-export */
function translateJunkId(param) {
  const joinParams = [
    param.slice(0, 8),
    param.slice(8, 12),
    param.slice(12, 16),
    param.slice(16, 20),
    param.slice(20),
  ].join('-')

  return joinParams
}

const phoneNumber = (number) => {
  const phoneNumber = number.trim()

  if (phoneNumber.includes('+')) {
    return phoneNumber.slice('1').replace(/^(855|8550)/, '0')
  }

  return phoneNumber.replace(/^(855|8550)/, '0')
}

const locationName = (addressComponents, state) => {
  let address = ''

  if (addressComponents.length <= 6 && state.long_name !== 'Phnom Penh') {
    address += `${addressComponents[0].long_name}, `
    address += `${addressComponents[1].long_name}, `

    if (addressComponents[3].types[0] !== 'country') {
      address += `${addressComponents[2].long_name}, `
      address += `${addressComponents[3].long_name}`
    } else {
      address += `${addressComponents[2].long_name}`
    }
  } else if (addressComponents.length <= 6) {
    address += `${addressComponents[0].long_name}, `
    address += `${addressComponents[1].long_name}, `
    address += `${addressComponents[2].long_name}`
  } else {
    address += `St ${addressComponents[0].long_name}, `
    address += `${addressComponents[1].long_name}, `
    address += `${addressComponents[2].long_name}, `
    address += `${addressComponents[3].long_name}`
  }

  return address
}

const sliceLocationName = (place) =>
  place.replace(/, Cambodia|Cambodia, |Cambodia|Province|Province/gi, '')

const productType = (title) => {
  const isMultipleVariant = title.split('/').length > 1

  if (isMultipleVariant) {
    return Number(title.split('/')[0]) ? 'shoes' : 'shirt'
  } else {
    return 'bag'
  }
}

export default {
  productType,
  phoneNumber,
  locationName,
  translateJunkId,
  sliceLocationName,
}
