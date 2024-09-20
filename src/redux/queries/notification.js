import { gql } from "@apollo/client"

export const GET_ANNOUNCEMENT = gql`
  query {
    boorran_Notifications(
      where: { channel: { _eq: "storefront" }, type: { _eq: "announcement" } },
      order_by: { created_at: desc },
      limit: 1
    ) {
      id
      end
      start
      title: message
    }
  }
`

export const GET_NOTIFICATIONS = gql`
  query {
    boorran_Notifications(where: { channel: { _eq: "storefront" }, type: { _eq: "notification" } }) {
      id
      end
      start
      image
      metadata
      description
      title: message
    }
  }
`