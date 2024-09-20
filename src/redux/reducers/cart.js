/* eslint-disable import/no-anonymous-default-export */
import Immutable from 'seamless-immutable'

export const TYPES = {
  GET_LOCAL_STORAGE_CART: 'GET_LOCAL_STORAGE_CART',

  SET_PRODUCT_TO_CART: 'SET_PRODUCT_TO_CART',
  REMOVE_PRODUCT_FROM_CART: 'REMOVE_PRODUCT_FROM_CART',
}

const INITIAL_STATE = Immutable({
  cart: {},
})

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TYPES.SET_PRODUCT_TO_CART:
      return state.set('cart', action.payload)
    case TYPES.REMOVE_PRODUCT_FROM_CART:
      return state.set('cart', action.payload)
    default:
      return state
  }
}
