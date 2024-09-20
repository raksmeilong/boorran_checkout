import { gql } from "@apollo/client"
import { orderHistoryFields } from "./order"

export const customerAddressFields = `
  id
  city
  phone
  address
  location
  lastName
  firstName
  isDefault
  shopifyAddressId
  countOrders: Orders_aggregate {
    aggregate {
      count
    }
  }
`

export const GET_CUSTOMER_ADDRESSES = gql`
  query($customerShopifyId: String, $limit: Int, $offset: Int) {
    boorran_CustomerAddress(
      where: { shopifyCustomerId: {_eq: $customerShopifyId } },
      order_by: { isDefault: desc }
      limit: $limit,
      offset: $offset
    ) {
      ${customerAddressFields}
    }
    boorran_CustomerAddress_aggregate (
      where: { shopifyCustomerId: {_eq: $customerShopifyId } },
    ) {
      aggregate {
        count
      }
    }
  }
`

export const DELETE_CUSTOMER_ADDRESS = gql`
  mutation($id: uuid) {
    delete_boorran_CustomerAddress(where: { id: { _eq: $id } }) {
      affected_rows
    }
  }
`

export const GET_CUSTOMER_ADDRESS_ORDERS = gql`
  query($addressId: uuid, $limit: Int, $offset: Int) {
    boorran_CustomerAddress(where: { id: { _eq: $addressId } }) {
      Orders(limit: $limit, offset: $offset) {
        ${orderHistoryFields}
      }
    }
  }
`
