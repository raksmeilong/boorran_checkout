/* eslint-disable import/no-anonymous-default-export */
import Immutable from 'seamless-immutable'

export const TYPES = {
	GET_CUSTOMER: 'GET_CUSTOMER',
	GET_CUSTOMER_BY_PHONE: 'GET_CUSTOMER_BY_PHONE',
	UPDATE_CUSTOMER: 'UPDATE_CUSTOMER',
}

const INITIAL_STATE = Immutable({
	data: {},
	auth: null
})

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case TYPES.GET_CUSTOMER_BY_PHONE:
			return state.set('auth', action.payload)
		case TYPES.GET_CUSTOMER:
			const {customer} = action.payload

			return state.set('data', customer)
		default:
			return state
	}
}
