import React, { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useQuery } from "@apollo/client"
import { Grid, Container, Typography, ButtonBase } from "@mui/material"
import { get } from "lodash"

import Tabs from "../../components/Tabs"
import GoogleMap from "../../components/Map"
import Navigate from "../../components/Navigate"
import Circular from "../../components/Circular"
import OrderListing from "../../components/OrderListing"

import { GET_CUSTOMER_ADDRESS_ORDERS } from "../../redux/queries/address"

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
  },
  defaultButton: {
    p: 1,
    width: '100%',
    color: 'white',
    borderRadius: 2,
    bgcolor: '#08024a',
  }
}

const SavedAddressDetails = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [activeTab, setActiveTab] = useState('location')

  const addressDetails = get(location, 'state.address', {})

  const lastName = get(addressDetails, 'lastName', '')
  const firstName = get(addressDetails, 'firstName', '')

  const { data: customerAddressOrders, loading } = useQuery(GET_CUSTOMER_ADDRESS_ORDERS, {
    variables: {
      limit: 10,
      offset: 0,
      addressId: addressDetails.id
    }
  })

  const addressOrderName = `${typeof lastName !== 'object' ? lastName : '' } ${typeof firstName !== 'object' ? firstName : null}`.trim()
  const addressOrders = get(customerAddressOrders, 'boorran_CustomerAddress[0].Orders', [])
  const totalAddressOrders = get(addressDetails, 'countOrders.aggregate.count', 0)

  const onBackPress = () => navigate(-1)

  const renderDetails = () => {
    return (
      <Grid item container sx={styles.rowContainer} justifyContent="space-between">
        <Grid item container flexDirection="column">
          <Grid container justifyContent="space-between">
            <Typography fontWeight="600" sx={{ fontSize: 13 }}>
              Name:
            </Typography>

            <Typography sx={{ fontSize: 13 }}>
              {addressOrderName}
            </Typography>
          </Grid>

          <Grid container justifyContent="space-between">
            <Typography fontWeight="600" sx={{ fontSize: 13 }}>
              Phone:
            </Typography>

            <Typography sx={{ fontSize: 13 }}>
              {addressDetails.phone}
            </Typography>
          </Grid>

          <Grid>
            <Typography fontWeight="600" sx={{ fontSize: 13 }}>
              Address:
            </Typography>

            <Typography sx={{ fontSize: 13, flex: 0.8 }}>
              {addressDetails.address}
            </Typography>
          </Grid>

          <Grid sx={{ my: 1 }}>
            <GoogleMap
              readOnly
              location={{
                lat: Number(addressDetails.location.split(',')[0]),
                lng: Number(addressDetails.location.split(',')[1])
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    )
  }

  const renderOrders = () => {
    return (
      <OrderListing
        orders={addressOrders}
        loadmore={() => {}}
        onClick={(orderId) => navigate(`order/${orderId}`)}
        hasMore={addressOrders.length < (totalAddressOrders - 1)}
      />
    )
  }

  const TABS = [
    {
      label: 'Location',
      value: 'location',
      style: { borderTopLeftRadius: 4, borderBottomLeftRadius: 4 },
      isActive: activeTab === 'location',
      onClick: () => setActiveTab('location')
    },
    {
      label: `Orders (${totalAddressOrders})`,
      value: 'orders',
      style: { borderTopRightRadius: 4, borderBottomRightRadius: 4 },
      isActive: activeTab === 'orders',
      onClick: () => setActiveTab('orders')
    }
  ]

  return (
    <>
      <Container maxWidth="xs" disableGutters sx={styles.container}>
        {loading ? (
          <Circular />
        ) : (
          <>
            <Navigate title="Saved Address" onBackPress={onBackPress} />
            <Tabs tabs={TABS} activeTab={activeTab} />

            <Grid>
              {activeTab === 'location' ? renderDetails() : renderOrders()}
            </Grid>
          </>
        )}
      </Container>
    </>
  )
}

export default SavedAddressDetails
