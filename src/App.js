import React, { useState, useEffect } from 'react'
import { ThemeProvider } from '@mui/material'
import { useDispatch } from "react-redux"
import { ApolloProvider } from '@apollo/client'
import { createTheme } from '@mui/material/styles'
import { getAuth } from "firebase/auth"

import Routes from './routes'
import ApolloClient from './config/apollo'

import Circular from "./components/Circular"
import { getProfile } from "./redux/actions/auth"
import { getNotifications } from "./redux/actions/notifications"

const theme = createTheme({
  palette: {
    primary: {
      main: "#08024A",
    },
    secondary: {
      main: "#9da6af",
    },
    yellow: {
      main: "#e5b13ed9",
    }
  },
  typography: {
    fontFamily: ["Lato", "sans-serif"].join(","),
  },
});

const App = () => {
  const dispatch = useDispatch()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const unsubscribe = getAuth().onAuthStateChanged(async (user) => {
      if (user) {
        await dispatch(getProfile({ phoneNumber: user.phoneNumber }))
      }

      dispatch(getNotifications())
      setAuthorized(true)
    })

    return unsubscribe
  }, [])

  return (
    <ApolloProvider client={ApolloClient}>
      <ThemeProvider theme={theme}>
        {authorized ? <Routes /> : <Circular containerStyles={{ bgcolor: 'none' }} />}
        {/* <div className="container mx-auto text-center box-border relative  h-32 w-32 p-4 border-4 m-9" >
       
<span className="box-decoration-clone bg-gradient-to-r from-indigo-600 to-pink-500 text-white px-2 ">
  Boorran<br />
  We will back soon.❤️
</span></div> */}
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default App;
