import React from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { useQuery } from "@apollo/client"
import { Grid, Container, Typography } from "@mui/material"
import { get } from "lodash"
import libphonenumber from "libphonenumber-js"
import moment from "moment"

import utils from "../../utils"

import GoogleMap from '../../components/Map'
import Navigate from "../../components/Navigate"
import Circular from "../../components/Circular"
import ProductList from "../../components/ProductList"

import { GET_ORDER_DETAILS } from "../../redux/queries/order"

const styles = {
  container: {
    pl: 2,
    pt: 7,
    pr: 2,
    pb: 15,
  },
  rowContainer: {
    p: 2,
    mb: 1.5,
    boxShadow: 1,
    borderRadius: 2
  }
}

const OrderDetails = () => {
  const urlParams = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const orderId = urlParams.orderId || urlParams.id || null

  const { data, loading } = useQuery(GET_ORDER_DETAILS, { variables: { orderId } })
  const orderDetails = get(data, ['boorran_Orders', [0]], null)

  const note = get(orderDetails, 'note', null)
  const total = get(orderDetails, 'subTotal', 0)
  const subTotal = get(orderDetails, 'itemsPrice', 0)
  const driverId = get(orderDetails, 'delivererId', '')
  const packStatus = get(orderDetails, 'packStatus', '')
  const discount = get(orderDetails, 'discountPrice', 0)
  const orderNumber = get(orderDetails, 'orderNumber', 0)
  const shippingPrice = get(orderDetails, 'deliveryPrice', 0)
  const paymentStatus = get(orderDetails, 'paymentStatus', '')
  const paymentMethod = get(orderDetails, 'paymentMethod', 'Pending...')
  const isCollectedByAdmin = get(orderDetails, 'isCollectedByAdmin', false)

  const orderAt = get(orderDetails, 'createdAt', Date.now())
  const createAtWithClock = moment(orderAt).format('DD MMM, YYYY [at] hh:mm A')

  const customerAddress = get(orderDetails, 'address', {})

  const name = `${customerAddress.lastName || ''} ${customerAddress.firstName || ''}`.trim()
  const phoneNumber = get(customerAddress, 'phone', null)
  const address = get(customerAddress, 'address', null)
  const coordinate = get(customerAddress, 'location', '')

  const backToHome = get(location, 'state.backToHome', false)

  const onBackPress = () => {
    if (backToHome) {
      navigate('/', { replace: true })
    } else {
      navigate(-1)
    }
  }

  const renderStatus = () => {
    const { status, color } = utils.helpers.getOrderLabelAndStatus({
      packStatus,
      driverId,
      paymentStatus,
      isCollectedByAdmin
    })

    return (
      <Grid item container sx={styles.rowContainer} justifyContent="space-between">
        <Grid item>
          <Typography fontWeight="bold" sx={{ fontSize: 15 }}>Status</Typography>
        </Grid>

        <Grid item>
          <Typography fontWeight="bold" sx={{ color, fontSize: 15 }}>{status}</Typography>
        </Grid>
      </Grid>
    )
  }

  const renderPaymentMethod = () => {
    return (
      <Grid item container sx={styles.rowContainer} justifyContent="space-between">
        <Grid item>
          <Typography fontWeight="bold" sx={{ fontSize: 15 }}>Payment Method</Typography>
        </Grid>

        <Grid item>
          <Typography fontWeight="bold" sx={{ fontSize: 15 }}>{paymentMethod}</Typography>
        </Grid>
      </Grid>
    )
  }

  const renderNote = () => {
    if (!note) return null

    return (
      <Grid item container sx={styles.rowContainer} justifyContent="space-between">
        <Grid item sx={{ mb: 1 }}>
          <Typography fontWeight="bold" sx={{ fontSize: 15 }}>Note</Typography>
        </Grid>

        <Grid item container>
          <Typography sx={{ fontSize: 13 }}>{note}</Typography>
        </Grid>
      </Grid>
    )
  }

  const renderDeliverContact = () => {
    const parsedPhoneNumber = libphonenumber(phoneNumber, 'KH')

    return (
      <Grid item container sx={styles.rowContainer} justifyContent="space-between">
        <Grid item sx={{ mb: 1 }}>
          <Typography fontWeight="bold" sx={{ fontSize: 15 }}>Deliver contact</Typography>
        </Grid>

        <Grid item container flexDirection="column">
          <Grid>
            <Grid container justifyContent="space-between">
              <Typography fontWeight="600" sx={{ fontSize: 13 }}>
                Name:
              </Typography>

              <Typography sx={{ fontSize: 13 }}>
                {name}
              </Typography>
            </Grid>

            <Grid container justifyContent="space-between">
              <Typography fontWeight="600" sx={{ fontSize: 13 }}>
                Phone:
              </Typography>

              <Typography sx={{ fontSize: 13 }}>
                {parsedPhoneNumber.number}
              </Typography>
            </Grid>

            {address && (
              <Grid>
                <Typography fontWeight="600" sx={{ fontSize: 13 }}>
                  Address:
                </Typography>

                <Typography sx={{ fontSize: 13, flex: 0.8 }}>
                  {address}
                </Typography>
              </Grid>
            )}
          </Grid>

          {coordinate && (
            <Grid sx={{ mt: 1 }}>
              <GoogleMap
                readOnly
                location={{
                  lat: Number(coordinate.split(',')[0]),
                  lng: Number(coordinate.split(',')[1])
                }}
              />
            </Grid>
          )}
        </Grid>
      </Grid>
    )
  }

  return (
    <>
      <Container maxWidth="xs" disableGutters sx={styles.container}>
        {loading ? (
          <Circular />
        ) : (
          <>
            <Navigate
              title={`Order #${orderNumber}`}
              subTitle={createAtWithClock}
              onBackPress={onBackPress}
            />

            <Grid>
              <ProductList
                type="checkout"
                total={total}
                discount={discount}
                subTotal={subTotal}
                deliveryMethod={null}
                shippingPrice={shippingPrice}
                products={orderDetails.orderItems}
                containerStyles={{ mb: 1 }}
              />

              {renderStatus()}
              {renderPaymentMethod()}
              {renderDeliverContact()}
              {renderNote()}
            </Grid>
          </>
        )}
      </Container>
    </>
  )
}

export default OrderDetails
