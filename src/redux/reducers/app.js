/* eslint-disable import/no-anonymous-default-export */
import Immutable from 'seamless-immutable'

export const TYPES = {
  SET_ACTIVE_TAB: 'SET_ACTIVE_TAB'
}

const INITIAL_STATE = Immutable({
  activeTab: '',
})

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TYPES.SET_ACTIVE_TAB:
      return state.set('activeTab', action.activeTab)
    default:
      return state
  }
}
