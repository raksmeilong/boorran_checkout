import React from 'react'
import { Grid, Paper, Radio, RadioGroup, Typography, FormControlLabel } from '@mui/material'

const styles = {
  headline: {
    pl: 4,
    pr: 4,
    pt: 1,
    pb: 1,
  },
  information: {
    pl: 3,
    py: 3,
    display: 'flex',
    borderRadius: 2,
    flexDirection: 'column',
  },
  method: {
    my: 1,
    width: '100%',
    borderRadius: 1,
  },
}

const DeliveryMethodSection = (props) => {
  const { paymentMethod, shippingPrice, deliveryMethod, setDeliveryMethod, deliveryConfigs } = props
  const { twoHoursFee, sameDayFee } = deliveryConfigs

  const COURIERS = [
    {
      name: `2-Hours Delivery ($ ${(Number(shippingPrice) + Number(twoHoursFee)).toFixed(2)})`,
      value: '2-hour',
      price: Number(twoHoursFee),
    },
    {
      name: `Same-Day Delivery ($ ${Number(sameDayFee).toFixed(2)})`,
      value: 'same-day',
      price: Number(sameDayFee),
    },
    { name: 'FREE One-Day Delivery', value: 'free', price: 0 },
  ]

  const renderHeadline = () => {
    return (
      <Grid item sx={styles.headline}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Delivey Methods
        </Typography>

        <Typography variant="subtitle1" sx={{ fontSize: 12 }}>
          Please choose your courier
        </Typography>
      </Grid>
    )
  }

  return (
    <>
      {renderHeadline()}
      <Paper sx={styles.information}>
        <Typography gutterBottom variant="subtitle2" sx={{ fontWeight: 'bold' }}>
          Couriers
        </Typography>

        <RadioGroup
          aria-label="delivery-details"
          value={deliveryMethod || ''}
          name="state-radio-button-group"
          onChange={(e) => {
            setDeliveryMethod(e.target.value)
          }}
        >
          {COURIERS.map((courier) => {
            const isSelected = deliveryMethod === courier.value
            const disabled = courier.value === 'free' && paymentMethod === 'cash-on-delivery'
            const disabledStyle = disabled
              ? { border: '1px solid lightgrey', color: 'lightgrey' }
              : {}

            const style = isSelected
              ? { border: '1px solid #08024A' }
              : { border: '1px solid lightgrey' }

            return (
              <FormControlLabel
                key={courier.value}
                value={courier.value}
                sx={[styles.method, style, disabledStyle]}
                control={<Radio size="small" disabled={disabled} />}
                label={<Typography sx={{ fontSize: 14 }}>{courier.name}</Typography>}
              />
            )
          })}
        </RadioGroup>
      </Paper>
    </>
  )
}

export default DeliveryMethodSection
