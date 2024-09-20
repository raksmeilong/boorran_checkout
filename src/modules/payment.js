import { requestGenerateABAKhqr, requestCheckTransactionABAKhqr } from '../redux/actions/checkout'

export default class Payment {
  static generateABAKhqr = async (data) => {
    try {
      const req = await requestGenerateABAKhqr(data)

      if (req.statusCode !== 200) throw 'Error KHQR'

      return req
    } catch (err) {
      throw err
    }
  }

  static checkTransactionABAKhqr = async data => {
    try {
      const req = await requestCheckTransactionABAKhqr(data)

      if (req.statusCode !== 200) throw 'Error Check Transaction KHQR'

      return req
    } catch (err) {
      throw err
    }
  }
}
