import { TYPES } from '../reducers/categories'
import { NODE_URL } from '../config'
import reduce from 'lodash/reduce'

export const setLoading = (type, value) => ({ type, loading: value })
