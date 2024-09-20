import { gql } from "@apollo/client"

import { customerAddressFields } from "./address"

export const GET_PROFILE = gql`
  query($phoneNumber: String) {
    boorran_Customers(where: { phone: { _eq: $phoneNumber } }) {
      id
      firstName
      lastName
      email
      phone
      address
      shopifyCustomerId
      defaultAddress: CustomerAddresses(where: { isDefault: { _eq: true } }) {
        ${customerAddressFields}
      }
    }
  }
`

export const UPDATE_PROFILE = gql`
  mutation($phoneNumber: String, $object: boorran_Customers_set_input) {
    update_boorran_Customers(where: { phone: { _eq: $phoneNumber } }, _set: $object) {
    returning {
      firstName
      lastName
      email
      phone
      address
    }
  }
  }
`
