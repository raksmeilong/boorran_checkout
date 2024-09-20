import React from 'react'
import { Grid, Typography } from '@mui/material'

const styles = {
  text: {
    fontSize: 17,
    fontWeight: 'bold',
  },
}

const PaymentSummary = (props) => {
  const { total, subTotal } = props

  return (
    <Grid item>
      <Grid container={true} justifyContent={'space-between'}>
        <Typography variant="subtitle2">Subtotal:</Typography>

        <Typography variant="subtitle2">{`$${subTotal.toFixed(2)}`}</Typography>
      </Grid>

      <Grid container={true} justifyContent={'space-between'}>
        <Typography variant="subtitle2">Save:</Typography>

        <Typography variant="subtitle2">- $0.00</Typography>
      </Grid>

      <Grid container={true} justifyContent={'space-between'}>
        <Typography variant="subtitle2" sx={styles.text}>
          Total:
        </Typography>

        <Typography variant="subtitle2" sx={styles.text}>
          {`$${total}`}
        </Typography>
      </Grid>
    </Grid>
  )
}

export default PaymentSummary
