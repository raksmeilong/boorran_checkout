import {gql} from "@apollo/client";

const products = `
  node {
    id
    title
    vendor
    handle
    totalInventory
    featuredImage {
      transformedSrc(maxWidth: 360)
    }
    priceRangeV2 {
      minVariantPrice {
        amount
      }
    }
  }
`;

export const GET_COLLS_RETURN_PRODUCTS = gql`
  query getCOLLS {
    channel(id: "gid://shopify/Channel/41813868633") {      
    collections(first: 50 ) {
      edges {
        node {
          id
          title
          handle
          products(first: 4) {
            nodes {
              id
              title
              handle
              vendor
              totalInventory
              featuredImage {
                transformedSrc(maxWidth: 360)
              }
              priceRangeV2 {
                minVariantPrice {
                  amount
                }
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }}
`;

export const SEARCH_PRODUCTS = gql`
  query searchProducts($query: String) {
    products(first: 5, query: $query) {
      edges {
        node {
          id
          title
          handle
          featuredImage {
            transformedSrc(maxWidth: 50)
          }
        }
      }
    }
  }
`;

export const GET_PRODUCTS = gql`
  query getProducts($first: Int!, $after: String, $query: String!) {
    products(first: $first, after: $after, query: $query) {
      edges {${products}}
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_DISCOUNTS = gql`
  query getDiscounts {
    boorran_Discounts {
      title
      type
      amount
      productId: Product {
        itemId
      }
    }
  }
`;

export const GET_PRODUCT_DETAILS = gql`
  query getProductDetail($sku: String!) {
    productByHandle(handle: $sku) {
      id
      title
      status
      vendor
      bodyHtml
      productType
      totalInventory
      images(first: 25) {
        edges {
          node {
            transformedSrc(maxWidth: 360)
            thumbnailImg: transformedSrc(
              maxWidth: 100
              maxHeight: 120
              crop: CENTER
            )
            altText
          }
        }
      }
      options {
        id
        name
        values
        position
      }
      variants(first: 250) {
        nodes {
          id
          sku
          title
          price
          position
          inventoryQuantity
          image {
            id
            thumbnailImg: transformedSrc(
              maxWidth: 100
              maxHeight: 120
              crop: CENTER
            )
          }
          selectedOptions {
            name
            value
          }
        }
      }
    }
  }
`;

export const GET_DISCOUNT_BY_PRODUCT_IDS = gql`
  query getDiscountByProductIds($productIds: [String!]) {
    boorran_Discounts(where: { Product: { itemId: { _in: $productIds } } }) {
      amount
      type
      title
      endedAt
      startedAt
      variantIds
      salesChannels
      onlinePaymentType
      onlinePaymentAmount
      productId: Product {
        itemId
      }
    }
  }
`;

export const GET_STOCK_CONFIGS = gql`
  query getStockConfigs($path: String!) {
    stockConfig: boorran_Configs(where: { key: { _eq: "stock" } }) {
      enabled: value(path: "limit_out_of_stock.enabled")
      variants: value(path: $path)
    }
  }
`;

export const GET_CONFIGS = gql`
  query getConfigs {
    discountOnlinePayment: Enums(
      where: { type: { _eq: "discountOnlinePayment" } }
    ) {
      metadata
    }
    deliveryConfigs: boorran_Configs(
      where: { key: { _in: ["delivery", "shopLocation"] } }
    ) {
      key
      value
    }
    paymentMethods: Enums(where: { type: { _eq: "paymentMethod" } }) {
      id
      type
      text
      value
      metadata
    }
  }
`;

export const GET_VARIANTS_BY_IDS = gql`
  query getVariantsByIds($ids: [String!]) {
    variants: boorran_ProductVariants(where: { itemId: { _in: $ids } }) {
      id: itemId
      quantity
    }
  }
`

export const GET_ORDER_BY_CUSTOMER = gql`
  query getOrdersByCustomer($customerId: uuid) {
    boorran_Orders(where: { customerId: { _eq: $customerId } }) {
      id status note orderAddress
      deliveryStatus deliveryPrice deliveryDestination deliverBy
      discount subTotal paymentMethod grandTotal 
      createdAt
    }
  }
`
