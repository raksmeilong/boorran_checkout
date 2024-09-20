import React from 'react'
import { Grid, Typography } from '@mui/material'
import ProductList from '../../../components/ProductList'

const styles = {
  headline: {
    pl: 4,
    pr: 4,
    pt: 1,
    pb: 1,
  },
  productListing: {
    p: 3,
    display: 'flex',
    borderRadius: 2,
    flexDirection: 'column',
  },
}

const OrderSummarySection = (props) => {
  const {
    type,
    total,
    discount,
    subTotal,
    shippingPrice,
    deliveryMethod,
    displaySavingInfo,
    handleDiscountInfo,
  } = props

  return (
    <>
      <Grid item sx={styles.headline}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Order Summary
        </Typography>

        <Typography variant="subtitle1" sx={{ fontSize: 12 }}>
          Please verify your products before place order
        </Typography>
      </Grid>

      <ProductList
        type={type}
        total={total}
        discount={discount}
        subTotal={subTotal}
        shippingPrice={shippingPrice}
        deliveryMethod={deliveryMethod}
        displaySavingInfo={displaySavingInfo}
        handleDiscountInfo={handleDiscountInfo}
      />
    </>
  )
}

export default OrderSummarySection
