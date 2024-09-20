/* eslint-disable import/no-anonymous-default-export */
import Immutable from 'seamless-immutable'

export const TYPES = {
	SET_PROFILE: 'SET_PROFILE',
}

const INITIAL_STATE = Immutable({
	data: null
})

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case TYPES.SET_PROFILE:
			return state.set('data', action.payload)
		default:
			return state
	}
}
