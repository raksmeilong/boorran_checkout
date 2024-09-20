import { TYPES } from "../reducers/auth"
import { GET_PROFILE, UPDATE_PROFILE } from "../queries/auth"

import ApolloClient from "../../../src/config/apollo"

export const setProfile = (payload) => (dispatch) => {
  dispatch({
    type: TYPES.SET_PROFILE,
    payload,
  })
}

export const getProfile = (data) => async (dispatch) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { phoneNumber } = data

      const response = await ApolloClient.query({
        query: GET_PROFILE,
        variables: { phoneNumber }
      })

      dispatch(setProfile(response.data.boorran_Customers[0]))
      resolve(true)
    } catch (err) {
      reject(new Error('Fail get profile.'))
    }
  })
}

export const updateProfle = (data) => async (dispatch) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { phoneNumber, object } = data

      const response = await ApolloClient.mutate({
        mutation: UPDATE_PROFILE,
        variables: { phoneNumber, object }
      })

      dispatch(setProfile(response.data.update_boorran_Customers.returning[0]))
      resolve(true)
    } catch (err) {
      reject(new Error('Fail update profile. Please try again!'))
    }
  })
}
