import { TYPES } from '../reducers/app'

export const setActiveTab = (activeTab) => (dispatch) => {
  dispatch({
    type: TYPES.SET_ACTIVE_TAB,
    activeTab
  })
}
