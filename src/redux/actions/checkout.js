import { POST } from 'fetchier'

import { NODE_URL } from '../config'

export const createOrder = (data) => {
  return POST({
    url: `${NODE_URL}/store-front/create-order`,
    body: data,
    headers: { 'Content-Type': 'application/json' },
  })
}

export const updateOrderPayment = (data) => {
  return POST({
    url: `${NODE_URL}/store-front/payment/update-order-payment`,
    body: data,
    headers: { 'Content-Type': 'application/json' },
  })
}

export const calculateDeliveryFee = (destination) => {
  return POST({
    url: `${NODE_URL}/store-front/calculate-delivery-fee`,
    body: { destination },
    headers: { 'Content-Type': 'application/json' },
  })
}

export const requestGenerateABAKhqr = (data) => {
  return POST({
    url: `${NODE_URL}/store-front/payment/aba-payway/khqr-code`,
    body: data,
    headers: { 'Content-Type': 'application/json' },
  })
}

export const requestCheckTransactionABAKhqr = (data) => {
  return POST({
    url: `${NODE_URL}/store-front/payment/aba-payway/check-transaction`,
    body: data,
    headers: { 'Content-Type': 'application/json' },
  })
}
