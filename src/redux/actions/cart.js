import { TYPES } from '../reducers/cart'

export const setProductToCart = (data) => (dispatch) => {
  window.localStorage.setItem('cart', JSON.stringify(data))

  dispatch({
    type: TYPES.SET_PRODUCT_TO_CART,
    payload: data,
  })
}

export const removeProductFromCart = (data) => (dispatch) => {
  window.localStorage.setItem('cart', JSON.stringify(data))

  dispatch({
    type: TYPES.REMOVE_PRODUCT_FROM_CART,
    payload: data,
  })
}
