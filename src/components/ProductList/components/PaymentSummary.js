import React from 'react'
import { Grid, Typography } from '@mui/material'
import { Info } from '@mui/icons-material'

const styles = {
  text: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  freePill: {
    px: 1,
    color: 'white',
    borderRadius: 1,
    bgcolor: '#08024A',
  },
  saveInfo: {
    ml: 0.5,
    mt: 0.1,
    fontSize: 15,
  },
}

const PaymentSummary = (props) => {
  const {
    type,
    total,
    subTotal,
    discount,
    shippingPrice,
    deliveryMethod,
    handleDiscountInfo,
    displaySavingInfo = false,
  } = props

  return (
    <Grid item>
      <Grid container justifyContent="space-between">
        <Typography variant="subtitle2">Subtotal</Typography>

        <Typography variant="subtitle2">{`$${subTotal.toFixed(2)}`}</Typography>
      </Grid>

      <Grid container justifyContent="space-between">
        <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center' }}>
          Discount
          {displaySavingInfo && <Info sx={styles.saveInfo} onClick={() => handleDiscountInfo()} />}
        </Typography>

        <Typography variant="subtitle2">- {`$${discount.toFixed(2)}`}</Typography>
      </Grid>

      {type === 'checkout' && (
        <Grid container justifyContent="space-between">
          <Typography variant="subtitle2">Delivery Fee</Typography>

          {deliveryMethod === 'free' && shippingPrice === 0 ? (
            <Typography variant="subtitle2" sx={styles.freePill}>
              FREE
            </Typography>
          ) : (
            <Typography variant="subtitle2">{`$${shippingPrice}`}</Typography>
          )}
        </Grid>
      )}

      <Grid container justifyContent="space-between">
        <Typography variant="subtitle2" sx={styles.text}>
          Total
        </Typography>

        <Typography variant="subtitle2" sx={styles.text}>
          {`$${total}`}
        </Typography>
      </Grid>
    </Grid>
  )
}

export default PaymentSummary
