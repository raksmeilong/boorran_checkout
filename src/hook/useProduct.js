import { useQuery, gql } from "@apollo/client";

const GET_PRODUCT = gql`
  query getAllProduct($urlParams: String!) {
    productByHandle(handle: $urlParams) {
      id
      handle
      title
      description
      productType
      vendor
      bodyHtml
      images(first: 15) {
        edges {
          node {
            transformedSrc(maxWidth: 360)
            altText
          }
        }
      }
      variants(first: 99) {
        edges {
          node {
            id
            title
            price
            image {
              transformedSrc(maxWidth: 72)
              altText
            }
            inventoryQuantity
          }
        }
      }
      options(first: 250) {
        id
        name
      }
    }
  }
`;

export const useProduct = (urlParams) => {
  const { error, loading, data } = useQuery(GET_PRODUCT, {
    variables: { urlParams },
  });
  return {
    error,
    loading,
    data,
  };
};
