import { combineReducers } from 'redux'

import app from './app'
import auth from './auth'
import cart from './cart'
import configs from './configs'
import customer from './customer'
import checkout from './checkout'
import products from './products'
import discounts from './discounts'
import notifications from './notifications'

export default combineReducers({
  app,
  auth,
  cart,
  configs,
  products,
  customer,
  checkout,
  discounts,
  notifications
})
