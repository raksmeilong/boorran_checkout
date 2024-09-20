/* eslint-disable no-useless-catch */
import { createOrder } from '../redux/actions/checkout'

export default class Order {
  static createOrder = async (payload) => {
    const {
      name,
      address,
      discount,
      customer,
      location,
      orderItems,
      phoneNumber,
      shippingPrice,
      customerDetailData: { CustomerAddresses },
    } = payload

    try {
      const shippingAddress = {
        lastName: '',
        id: customer.id,
        firstName: name,
        phone: phoneNumber,
        CustomerAddresses,
        shopifyCustomerId: CustomerAddresses.shopifyAddressId,
      }

      const orderData = {
        address,
        note: '',
        discount,
        orderItems,
        shippingPrice,
        shippingAddress,
        status: 'pending',
        deliveryStatus: 'Pending',
        deliveryDate: new Date().toISOString(),
        paymentMethod: 'Cash on Delivery (COD)',
        location: `${location.lat},${location.lng}`,
        customer: { id: customer?.shopifyCustomerId },
      }

      const order = await createOrder(orderData)

      return order
    } catch (error) {
      throw error
    }
  }
}
