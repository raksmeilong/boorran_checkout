import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Grid, Typography } from "@mui/material"
import { get } from "lodash"

import Modal from "../../../components/Modal"
import GoogleMap from "../../../components/Map"

import { updateAddress } from "../../../redux/actions/address"

const ModalAddress = ({ open, onClose, modalAddress }) => {
  const dispatch = useDispatch()
  const { data: auth } = useSelector(store => store.auth)

  const [loading, setLoading] = useState(false)

  const lastName = get(modalAddress, 'lastName', '')
  const firstName = get(modalAddress, 'firstName', '')
  const isDefault = get(modalAddress, 'isDefault', false)

  const addressOrderName =
    `${typeof lastName !== 'object' ? lastName : '' } ${typeof firstName !== 'object' ? firstName : null}`.trim()

  const onSubmit = async () => {
    const { shopifyCustomerId } = auth
    const { shopifyAddressId } = modalAddress

    try {
      await dispatch(updateAddress({
        isDefault: true,
        shopifyCustomerId,
        shopifyAddressId,
      }, {
        beforeAction: () => setLoading(true),
        afterAction: () => {
          setLoading(false)
          onClose({ refresh: true })
        }
      }))
    } catch (err) {
      alert(err.message || 'Fail to set default location, Please try agian!')
    }
  }

  let ACTIONS = [
    {
      label: 'Close',
      style: { bgcolor: '#8c8c8c' },
      onPress: onClose,
    }
  ]

  if (!isDefault) {
    ACTIONS.push({
      label: 'Set as default',
      loading,
      onPress: onSubmit,
    })
  }

  return (
    <Modal open={Boolean(open)} onClose={onClose} actions={ACTIONS}>
      <Grid sx={{ mb: 1 }}>
        <GoogleMap
          readOnly
          location={{
            lat: Number(modalAddress.location.split(',')[0]),
            lng: Number(modalAddress.location.split(',')[1])
          }}
        />
      </Grid>

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
          {modalAddress.phone}
        </Typography>
      </Grid>

      <Grid>
        <Typography fontWeight="600" sx={{ fontSize: 13 }}>
          Address:
        </Typography>

        <Typography sx={{ fontSize: 13, flex: 0.8 }}>
          {modalAddress.address}
        </Typography>
      </Grid>
    </Modal>
  )
}

export default ModalAddress
