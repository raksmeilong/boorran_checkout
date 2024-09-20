import React from "react"
import { useSelector } from "react-redux"
import { Grid, Typography, Container } from "@mui/material"
import { get } from "lodash"

import MyOrders from "./components/MyOrders"
import Settings from "./components/Settings"

const styles = {
  container: {
    pl: 2,
    pt: 7,
    pr: 2,
    pb: 15
  }
}

const Profile = () => {
  const { data } = useSelector(state => state.auth)

  const userName = `${get(data, 'lastName', '')} ${get(data, 'firstName', '')}`.trim()
  const email = get(data, 'email', data.phone)
  const phoneNumber = get(data, 'phone', '')

  return (
    <Container maxWidth="xs" disableGutters sx={styles.container}>
      <Grid container alignItems="center" sx={{ mb: 3, mt: 4 }}>
        <Grid item justifyContent="center">
          <img
            loading="lazy"
            alt="placeholder"
            style={{ width: 90, height: 90, borderRadius: '50%' }}
            src={require("../../assets/profile-placeholder.jpeg")}
          />
        </Grid>

        <Grid item alignItems="center" justifyContent="space-between" flexDirection="column" sx={{ pl: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: 17 }}>{userName}</Typography>
          <Typography>{phoneNumber}</Typography>
          {email && <Typography>{email}</Typography>}
        </Grid>
      </Grid>

      {/* <MyOrders /> */}
      <Settings profile={data} />
    </Container>
  )
}

export default Profile
