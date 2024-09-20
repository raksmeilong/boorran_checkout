import React, { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { Grid, Typography, IconButton,Container } from "@mui/material"
import { Home, Notifications, Person, Article } from "@mui/icons-material"
import { every, isEmpty } from "lodash"

import Modules from "../../modules"

import ActionButtons from "./ActionButtons"
import ModalLogin from "../../containers/Login"

import { setActiveTab } from "../../redux/actions/app"

const styles = {
  container: {
    bottom: 0,
    zIndex: 11,
    height: 60,
    width: "100%",
    display: "flex",
    position: "fixed",
    alignItems: "center",
    color: "text.primary",
    backgroundColor: "white",
    backdropFilter: "blur(9px)",
    padding: "0px 35px 0px 35px",
    justifyContent: "space-between",
    boxShadow: "0 1px 5px rgba(0, 0, 0, 0.3)",  
  },
  text: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FD0013'
  },
  iconWrapper: {
    width: 0,
    position: 'relative',
    flexDirection: 'column'
  },
  badege: {
    top: 7,
    left: 12,
    width: 10,
    height: 10,
    borderRadius: 100,
    position: 'absolute',
    backgroundColor: 'red',
  }
}

const Footer = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()

  const {
    notifications,
    app: { activeTab },
  } = useSelector(state => state)
  const [showLogin, setShowLogin] = useState(false)

  const isLoggedIn = Modules.authentication.currentUser()
  const pathName = location.pathname.split('/')[1]

  useEffect(() => {
    if (pathName === 'collections') {
      dispatch(setActiveTab(''))
    } else {
      dispatch(setActiveTab(pathName))
    }
  }, [pathName])

  let TABS = [
    {
      name: 'Home',
      value: '',
      renderIcon: (color) => <Home sx={{ color }} />,
      onPress: () => navigate('/'),
    },
    {
      name: 'Orders',
      value: 'orders',
      renderIcon: (color) => <Article sx={{ color }} />,
      onPress: () => {
        if (isLoggedIn) {
          navigate('/orders')
        } else {
          setShowLogin(true)
        }
      },
    },
    {
      name: 'Notifications',
      value: 'notifications',
      renderIcon: (color) => <Notifications sx={{ color }} />,
      onPress: () => navigate('/notifications'),
      badge: () => {
        const readedNotificationIds = window.localStorage.getItem("readedNotificationIds") || [];
        const isAllNotificationNotReaded = every(notifications.data, noti => !readedNotificationIds.includes(noti.id))

        return !isEmpty(notifications.data) && isAllNotificationNotReaded
          ? <div style={styles.badege} />
          : null
      },
    }
  ]

  if (isLoggedIn) {
    TABS.push({
      name: 'Profile',
      value: 'profile',
      renderIcon: (color) => <Person sx={{ color }} />,
      onPress: () => navigate('/profile'),
    },)
  } else {
    TABS.push({
      name: 'Sign in ',
      value: 'login',
      onPress: () => setShowLogin(true),
    },)
  }

  const isAppearFloatButton =
    ['/', '/orders'].includes(location.pathname) || 
    location.pathname.includes('/collections')

  const showFooter = [...TABS, { value: 'collections' }].map((tab) => tab.value).includes(pathName)

  if (!showFooter) return null

  return (
    <>
      <Grid container sx={styles.container} >
      <Container maxWidth="md">
          <Grid
            container
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
        {TABS.map(tab => {
          const isActive = activeTab === tab.value
          const color = isActive || tab.value === 'login' ? '#FD0013' : 'gray'

          return (
            <IconButton
              disableRipple
              disableFocusRipple
              key={tab.value}
              sx={styles.iconWrapper}
              onClick={tab.onPress}
            >
              {tab.badge ? tab.badge() : null}
              {tab.renderIcon ? tab.renderIcon(color) : null}
              <Typography sx={[styles.text, { color }, !tab.renderIcon && { fontSize: 13, width: 50 }]}>
                {tab.name}
              </Typography>
            </IconButton>
          )
        })}
        </Grid>
        </Container>
      </Grid>

      {showLogin && 
        <ModalLogin
          open={showLogin}
          onClose={() => setShowLogin(false)}
        />
      }

      {isAppearFloatButton &&
        <ActionButtons showOnlyScrollTop={location.pathname === '/orders'} />
      }
    </>
  )
}

export default Footer
