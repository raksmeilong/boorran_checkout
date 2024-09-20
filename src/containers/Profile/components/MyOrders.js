import React from 'react'
import { Grid, ButtonBase, Typography } from '@mui/material'
import { AssignmentTurnedIn, LocalShipping, Restore } from '@mui/icons-material'

const styles = {
  card: {
    display: 'flex',
    p: 2,
    borderRadius: 1.5,
    borderColor: "grey",
    border: "1px solid lightgray"
  }
}

const CARDS = [
  {
    name: 'To Receive',
    icon: () => <LocalShipping fontSize="large" sx={{ mr: 1 }} color="primary" />
  },
  {
    name: 'Completed',
    icon: () => <AssignmentTurnedIn fontSize="large" sx={{ mr: 1, color: "#00b100" }} />
  },
  {
    name: 'Cancelled',
    icon: () => <Restore fontSize="large" sx={{ mr: 0.5, color: 'red' }} />
  }
]

const Card = ({ card }) => {
  return (
    <ButtonBase disableRipple disableTouchRipple sx={styles.card}>
      {card.icon()}
      <Typography sx={{ fontSize: 11 }}>
        {card.name}
      </Typography>
    </ButtonBase>
  )
}

const MyOrders = () => {
  return (
    <Grid container flexDirection="column" sx={{ mb: 4 }}>
      <Grid sx={{ mb: 1 }}>
        <Typography fontWeight="bold">
          My Orders
        </Typography>
      </Grid>

      <Grid item display="flex" justifyContent="space-between" flexDirection="row">
        {CARDS.map((card) => <Card key={card.name} card={card} /> )}
      </Grid>
    </Grid>
  )
}

export default MyOrders
