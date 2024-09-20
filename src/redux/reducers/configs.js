/* eslint-disable import/no-anonymous-default-export */
import Immutable from 'seamless-immutable'

export const TYPES = {
  SET_STOCK_CONFIGS: 'SET_STOCK_CONFIGS',
  SET_PAYMENT_METHODS: 'SET_PAYMENT_METHODS',
  SET_DELIVERY_CONFIGS: 'SET_DELIVERY_CONFIGS',

  SET_DISCOUNT_ONLINE_PAYMENT: 'SET_DISCOUNT_ONLINE_PAYMENT',
}

const INITIAL_STATE = Immutable({
  stockLimit: {},
  paymentMethods: {},
  deliveryConfigs: {},

  discountOnlinePayment: {},
})

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TYPES.SET_PAYMENT_METHODS:
      return state.set('paymentMethods', action.payload)

    case TYPES.SET_DELIVERY_CONFIGS:
      return state.set('deliveryConfigs', action.payload)

    case TYPES.SET_DISCOUNT_ONLINE_PAYMENT:
      return state.set('discountOnlinePayment', action.payload)

    case TYPES.SET_STOCK_CONFIGS:
      return state.set('stockLimit', action.payload)

    default:
      return state
  }
}
