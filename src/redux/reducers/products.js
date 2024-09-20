/* eslint-disable import/no-anonymous-default-export */
import Immutable from 'seamless-immutable'
import utils from '../../utils'

export const TYPES = {
  FETCH_PRODUCTS: 'FETCH_PRODUCTS',

  FETCHED_CHECKOUT_PRODUCTS: 'FETCHED_CHECKOUT_PRODUCTS',
  FETCHED_CHECKOUT_PRODUCTS_VARIANTS: 'FETCHED_CHECKOUT_PRODUCTS_VARIANTS',

  SET_SHOPIFY_PRODUCTS: 'SET_SHOPIFY_PRODUCTS',
  SET_LOADING: 'SET_LOADING',
  SET_LOADING_VARIANTS: 'SET_LOADING_VARIANTS',

  SET_QUERY_COLLECTION: 'SET_QUERY_COLLECTION',

  SET_SHOW_MORE: 'SET_SHOW_MORE',
  SET_NEXT_PAGINATION: 'SET_NEXT_PAGINATION',
  SET_PAGINATE_LOADING: 'SET_PAGINATE_LOADING',
}

const INITIAL_STATE = Immutable({
  data: {},
  variants: {},

  productData: [],
  shopifyProducts: [],
  productsAggregate: 0,

  nextPagination: null,
  paginateLoading: false,

  activeCollection: '',
  query: utils.constants.queryCollection,

  showMore: '',
  loading: false,
  loadingVariants: false,
})

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TYPES.FETCH_PRODUCTS:
      return state
        .set('productData', [...state.productData, ...action.payload.products])
        .set('nextPagination', action.payload.pagination)
        .set('productsAggregate', action.payload.productsAggregate)
        .set('paginateLoading', false)

    case TYPES.FETCHED_CHECKOUT_PRODUCTS:
      const { products } = action.payload
      return state.set('data', products).set('loading', false)

    case TYPES.SET_LOADING:
      return state.set('loading', action.loading)

    case TYPES.SET_LOADING_VARIANTS:
      return state.set('loadingVariants', action.loading)

    case TYPES.SET_SHOPIFY_PRODUCTS:
      return state.set('shopifyProducts', action.payload)

    case TYPES.SET_PAGINATE_LOADING:
      return state.set('paginateLoading', action.loading)

    case TYPES.SET_NEXT_PAGINATION:
      return state.set('nextPagination', action.payload)

    case TYPES.SET_SHOW_MORE:
      return state.set('showMore', action.productName)

    case TYPES.SET_QUERY_COLLECTION:
      return state
        .set('query', action.payload.query)
        .set('activeCollection', action.payload.collection)

    case TYPES.FETCHED_CHECKOUT_PRODUCTS_VARIANTS:
      const { productId, productVariants, singleVariant, productType } = action.payload

      return state
        .set('variants', {
          ...state.variants,
          [productId]: {
            productType,
            productVariants,
            isSingleVariant: singleVariant,
          },
        })
        .set('loadingVariants', false)

    default:
      return state
  }
}
