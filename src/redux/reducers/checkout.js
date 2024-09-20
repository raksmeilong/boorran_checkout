/* eslint-disable import/no-anonymous-default-export */
import Immutable from 'seamless-immutable'

export const TYPES = {}

const INITIAL_STATE = Immutable({})

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    default:
      return state
  }
}
