import React, { useState, useEffect } from "react"
import { Grid, ButtonBase, Container, Typography } from "@mui/material"
import { LocalOffer } from "@mui/icons-material"
import { useSelector, useDispatch } from "react-redux"
import moment from "moment"
import { isEmpty } from "lodash"

import Navigate from "../../components/Navigate"
import ModalNotification from "./components/ModalNotification"

import { readNotification } from "../../redux/actions/notifications"

const styles = {
	container: {
		pl: 2,
		pt: 7,
		pr: 2,
		pb: 15,
	},
  row: {
		py: 1,
		px: 0.5,
		mb: 1.5,
		width: '100%',
    display: 'flex',
    borderRadius: 1.5,
    alignItems: 'flex-start',
		border: "1px solid lightgrey",
  },
  icon: {
		ml: 1,
		mr: 2,
		p: 0.3,
		boxShadow: 1,
		borderRadius: 100,
    alignSelf: 'flex-start',
	},
  title: {
    lineHeight: 1.7,
    overflow: "hidden",
    display: "-webkit-box",
    textOverflow: "ellipsis",
    WebkitLineClamp: "1",
    WebkitBoxOrient: "vertical",
  },
  dot: {
    width: 10,
    height: 10,
    bgcolor: 'red',
    borderRadius: 50,
  },
  breakText: {
    mt: 1,
    overflow: "hidden",
    display: "-webkit-box",
    textOverflow: "ellipsis",
    WebkitLineClamp: "2",
    WebkitBoxOrient: "vertical",
  }
}

const Notifications = () => {
  const dispatch = useDispatch()
  const { data: notifications } = useSelector(store => store.notifications)

  const readedNotificationsStorage = window.localStorage.getItem("readedNotificationIds") || [];
  const readedNotifications = !isEmpty(readedNotificationsStorage) ? JSON.parse(readedNotificationsStorage) : [];

  const [openNotification, setOpenNotification] = useState(null)
  const [seenNotifications, setSeenNotifications] = useState(readedNotifications)

  useEffect(() => {
    dispatch(readNotification(seenNotifications))
  }, [seenNotifications])

  const onClick = noti => {
    if (noti?.image) setOpenNotification(noti)

    if (!readedNotifications.includes(noti.id)) {
      setSeenNotifications(oldState => [...oldState, noti.id])
    }
  }

  return (
    <>
      <Container maxWidth="xs" disableGutters sx={styles.container}>
        <Navigate title="Notifications" visibleBackPress={false} />

        {!isEmpty(notifications) ? (
          <div>
            {notifications.map(noti => {
              const readed = readedNotifications.includes(noti.id)
              const date = moment(noti.start).format('DD MMM, YYYY')

              return (
                <ButtonBase
                  key={noti.id}
                  disableRipple
                  disableTouchRipple
                  sx={styles.row}
                  onClick={() => onClick(noti)}
                >
                  <Grid container>
                    <Grid item sx={styles.icon}>
                      <LocalOffer sx={{ color: 'red' }} fontSize="small" />
                    </Grid>

                    <Grid display="flex" flex={1} flexDirection="column">
                      <Grid container justifyContent="space-between">
                        <Grid item textAlign="start" sx={{ width: '90%' }}>
                          <Typography fontSize={14} fontWeight="bold" sx={styles.title}>{noti.title}</Typography>
                          <Typography fontSize={11} color="gray">{date}</Typography>
                        </Grid>

                        {!readed && <Grid item sx={styles.dot} />}
                      </Grid>

                      {noti.description && (
                        <Typography fontSize={11} align="left" sx={styles.breakText}>
                          {noti.description}
                        </Typography>
                      )}

                    </Grid>
                  </Grid>
                </ButtonBase>
              )
            })}
          </div>
        ) : (
          <Grid container justifyContent="center" alignItems="center" sx={{ mb: 3, mt: 4 }}>
            <Typography sx={{ mt: 20 }}>
              No Content
            </Typography>
          </Grid>
        )}

        {openNotification && (
          <ModalNotification
            open={openNotification}
            onClose={() => onClick(null)}
            notification={openNotification}
          />
        )}
      </Container>
    </>
  )
}

export default Notifications
