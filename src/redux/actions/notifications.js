import moment from "moment"
import { get } from "lodash"

import { TYPES } from '../reducers/notifications'
import { GET_NOTIFICATIONS } from "../queries/notification"

import ApolloClient from "../../../src/config/apollo"

export const getNotifications = () => async (dispatch) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await ApolloClient.query({
        query: GET_NOTIFICATIONS
      })

      dispatch({
        type: TYPES.SET_NOTIFICATIONS,
        payload:
          get(response, 'data.boorran_Notifications', [])
          .filter((noti) => moment().isBetween(noti.start, noti.end) && noti),
      })
      resolve(true)
    } catch (err) {
      reject(new Error('Fail get notifications.'))
    }
  })
}

export const readNotification = data => () =>
  window.localStorage.setItem('readedNotificationIds', JSON.stringify(data))
