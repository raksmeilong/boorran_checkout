import { gql } from "@apollo/client"

export const orderHistoryFields = `
  id
  boorranGrandTotal
  packStatus
  orderNumber: shopifyOrderNumber
  paymentStatus: status
  createdAt
  driverId: delivererId
  isCollectedByAdmin
  orderItemsCount: orderItems_aggregate {
    aggregate {
      count
    }
  }
`

export const GET_ORDER_DETAILS = gql`
  query($orderId: uuid) {
    boorran_Orders(where: { id: { _eq: $orderId } }) {
      note
      paymentStatus: status
      paymentMethod
      itemsPrice
      discountPrice: discount
      priceAfterDiscount: subTotal
      deliveryPrice
      subTotal: grandTotal
      isCollectedByAdmin
      packStatus
      delivererId
      orderNumber: shopifyOrderNumber
      createdAt
      orderItems {
        productName: itemTitle
        variantName: variantTitle
        quantity
        price: unitPrice
      }
      address {
        firstName
        lastName
        phone
        address
        location
      }
    }
  }
`

export const GET_ORDER_HISTORY = gql`
  query($customerShopifyId: String, $limit: Int, $offset: Int) {
    boorran_Orders(
      where: { customer: {shopifyCustomerId: {_eq: $customerShopifyId }} },
      order_by: {createdAt: desc},
      limit: $limit,
      offset: $offset
    ) {
      ${orderHistoryFields}
    }
    boorran_Orders_aggregate (
      where: { customer: {shopifyCustomerId: {_eq: $customerShopifyId }} },
    ) {
      aggregate {
        count
      }
    }
  }
`
