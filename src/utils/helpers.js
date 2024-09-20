/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
import { Cancel, DeliveryDining, Autorenew, CheckCircle } from "@mui/icons-material"
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { find, sumBy, reduce, groupBy, get } from 'lodash'

const uploadToFirebase = async ({ file, path = 'erp/images', name }) => {
  const storage = getStorage()
  const fileName = name || file.name
  const fullPath = `${path}/${fileName}`
  const fileRef = ref(storage, fullPath)

  await uploadBytes(fileRef, file)

  return getDownloadURL(fileRef)
}

const sumCartQuantity = (data) => sumBy(Object.values(data), 'quantity')

const calculateDiscountOnlinePayment = (totalPrice, discountOnlinePayment) => {
  let total = 0

  if (discountOnlinePayment.type === '%') {
    total = totalPrice - totalPrice * (Number(discountOnlinePayment.amount) / 100)
  } else {
    total = totalPrice - Number(discountOnlinePayment.amount)
  }

  return total.toFixed(2)
}

const sumCartSubTotal = (cart, discounts, discountOnlinePayment, paymentMethod) => {
  let subTotal = 0
  let discount = 0
  let prevTotal = 0
  let nextTotal = 0
  let onlinePaymentDiscount = 0

  // Calculate base price
  subTotal = sumBy(Object.values(cart), (product) => Number(product.price) * product.quantity)

  // Calculate discount price
  discount =
    sumBy(Object.values(cart), (product) => {
      const productId = product.productId
      const variantId = product.variant.id.split('/')[4]

      const variantDiscount = discounts ? find(discounts.boorran_Discounts, datum => datum.productId.itemId === productId) : {}
      const hasCartItemDiscount = get(variantDiscount, 'variantIds', []).includes(variantId)

      if (hasCartItemDiscount) {
        const discountPrice = calculateDiscountPrice(variantDiscount.type, variantDiscount.amount, Number(product.price))
        const savingPrice = discountPrice - product.price

        return Number(savingPrice) * product.quantity * -1
      }
    }) || 0

  // Calculate first total
  prevTotal = Number((subTotal - discount).toFixed(2))

  // Calculate discount with online payment discount
  if (paymentMethod === 'online-payment' && Number(discountOnlinePayment.amount) >= 0) {
    onlinePaymentDiscount = Number(
      (prevTotal - calculateDiscountOnlinePayment(prevTotal, discountOnlinePayment)).toFixed(2)
    )
    discount += onlinePaymentDiscount
  }

  // Calculate final total price after pass online paymment discount
  nextTotal = Number((subTotal - discount).toFixed(2))

  return { subTotal, discount, total: nextTotal, onlinePaymentDiscount }
}

const getVariantType = (optionType, data) => {
  const variantByOption = groupBy(data.variants, (variant) => variant.options[optionType])

  return reduce(
    variantByOption,
    (result, variants, key) => {
      result[key] = variants.map((variant) =>
        variant.inventory_qty !== 0 ? variant.options[optionType] : null
      )

      return result
    },
    {}
  )
}

const getVariantObj = (variants, selectedVariant) => {
  return find(
    variants,
    (variant) => JSON.stringify(variant.options) === JSON.stringify(selectedVariant)
  )
}

const calculateDiscountPrice = (type, amount, price) => {
  if (type === 'percentage') {
    return Number(price - ((price * amount) / 100).toFixed(2))
  }

  return Number(price - amount).toFixed(2)
}

const calculateSavingPrice = (type, amount, price) => {
  let discountPrice = 0

  if (type === 'percentage') {
    discountPrice = (price - (price * amount) / 100).toFixed(2)
  } else {
    discountPrice = (price - amount).toFixed(2)
  }

  return Number((discountPrice - price).toFixed(2))
}

const extractUrl = (url) => {
  const urlParmas = new URLSearchParams(url)

  const staffId = urlParmas.get('rfl')
  const discount = urlParmas.get('dis') || null
  const customerId = urlParmas.get('cus') || null
  const deliveryFee = urlParmas.get('dlv') || null

  if (!staffId && !discount && !deliveryFee && !customerId) return null

  const productIds = urlParmas.get('prd').split(',')
  const variantIds = productIds.map((prd) => {
    const variantId = prd.split('-')[0]
    const quantity = prd.split('-')[1]

    return {
      variantId,
      quantity,
    }
  })

  return { staffId, discount, variantIds, deliveryFee, customerId }
}

const getPaymentMethodLabel = (paymentMethod, paymentOption) => {
  if (paymentMethod === 'online-payment') {
    switch (paymentOption.value) {
      case 'aba_khqr':
        return 'ABA KHQR'
      case 'ToanChet':
        return 'Acleda'
      default:
        return 'WingBank'
    }
  }

  return 'Cash on Delivery (COD)'
}

const getOrderLabelAndStatus = ({ packStatus, driverId, paymentStatus, isCollectedByAdmin }) => {
  let result = {
    status: 'Pending',
    color: 'black',
    icon: <Autorenew color="yellow" />
  }

  if (isCollectedByAdmin && driverId) {
    result = {
      status: 'Delivered',
      color: "green",
      icon: <CheckCircle sx={{ color: 'green' }} />
    }
  } else if (paymentStatus === 'pending') {
    result = {
      status: 'Pending',
      color: 'black',
      icon: <Autorenew color="black" />
    }
  } else if (paymentStatus === 'cancelled') {
    result = {
      status: 'Cancelled',
      color: '#FD0013',
      icon: <Cancel sx={{ color: '#FD0013' }} />
    }
  } else if (packStatus === 'Pending') {
    result = {
      status: 'Packing...',
      color: 'black',
      icon: <Autorenew color="black" />
    }
  } else if (driverId) {
    result = {
      status: 'Delivering',
      color: 'goldenrod',
      icon: <DeliveryDining color="yellow" />
    }
  }

  return result
}

const exports = {
  extractUrl,
  getVariantObj,
  getVariantType,
  sumCartQuantity,
  sumCartSubTotal,
  uploadToFirebase,
  calculateSavingPrice,
  calculateDiscountPrice,
  getPaymentMethodLabel,
  getOrderLabelAndStatus,
}

export default exports
