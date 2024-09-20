import { POST } from 'fetchier'
import { NODE_URL } from "../../redux/config"

export const createAddress = (payload, { beforeAction, afterAction }) => async () => {
  return new Promise(async (resolve, reject) => {
    try {
      beforeAction()
      const req = await POST({
        url: `${NODE_URL}/store-front/address/create`,
        body: payload,
        headers: { 'Content-Type': 'application/json' },
      })

      afterAction()
      resolve(req)
    } catch (err) {
      afterAction()
      reject(new Error(err.message || 'Fail create address. Please try again!'))
    }
  })
}

export const updateAddress = (payload, { beforeAction, afterAction }) => async () => {
  return new Promise(async (resolve, reject) => {
    try {
      beforeAction()
      const req = await POST({
        url: `${NODE_URL}/store-front/address/update`,
        body: payload,
        headers: { 'Content-Type': 'application/json' },
      })

      afterAction()
      resolve(req)
    } catch (err) {
      afterAction()
      reject(new Error(err.message || 'Fail update address. Please try again!'))
    }
  })
}