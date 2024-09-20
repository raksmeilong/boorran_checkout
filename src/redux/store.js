import { applyMiddleware, compose, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer from './reducers'

const createReduxStore = () => {
  const middleware = applyMiddleware(thunkMiddleware)
  const enhancer = compose(middleware)
  const store = createStore(rootReducer, {}, enhancer)

  return store
}

export default createReduxStore()
