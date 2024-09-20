/* eslint-disable import/no-anonymous-default-export */
import Immutable from 'seamless-immutable'

export const TYPES = {
	SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
}

const INITIAL_STATE = Immutable({
	data: []
})

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case TYPES.SET_NOTIFICATIONS:
			return state.set('data', action.payload)
		default:
			return state
	}
}
