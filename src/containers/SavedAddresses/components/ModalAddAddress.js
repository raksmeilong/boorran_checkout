import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Grid, Typography } from "@mui/material"
import libphonenumber from "libphonenumber-js"
import { get } from "lodash"

import utils from "../../../utils"

import Input from "../../../components/Input"
import Modal from "../../../components/Modal"
import GoogleMap from "../../../components/Map"
import Checkbox from "../../../components/Checkbox"

import { createAddress } from "../../../redux/actions/address"

const ModalAddNewAddress = ({ open, onClose }) => {
  const dispatch = useDispatch()
  const { data: auth } = useSelector(store => store.auth)

  const [phone, setPhone] = useState(undefined)
  const [lastName, setLastName] = useState('')
  const [firstName, setFirstname] = useState('')

  const [isDefault, setIsDefault] = useState(false)
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(false)

  const validation = () => {
    return new Promise((resolve, reject) => {

      if (!lastName) {
        return reject(Error('Last Name cannot be blank'))
      }

      if (!firstName) {
        return reject(Error('First Name cannot be blank'))
      }

      if (!phone || phone.length === 0) {
        return reject(Error('Phone number cannot be blank'))
      }

      if (
        !libphonenumber(phone, 'KH') ||
        !libphonenumber(phone, 'KH').isValid()
      ) {
        return reject(Error('Invalid Phone number'))
      }

      return resolve(true)
    })
  }

  const onSave = async () => {
    const { id, shopifyCustomerId } = auth

    try {
      await validation()
      await dispatch(createAddress({
        isDefault,
        customerId: id,
        shopifyCustomerId,
        city: location.city,
        address: location.address,
        location: location.position,
        phone: libphonenumber(phone, 'KH').number,
        name: `${lastName || ''} ${firstName || ''}`.trim()
      }, {
        beforeAction: () => setLoading(true),
        afterAction: () => {
          setLoading(false)
          onClose({ refresh: true })
        }
      }))

    } catch (err) {
      setLoading(false)
      alert(err.message || err)
    }
  }

  /**
  * @param {Object & { lat: number, lng: number }} location - Coordinate from map component
  */
  const onLocationChange = async location => {
    const place = await utils.map.getGeocodeFromLatLng(location)
    setLocation(place)
  }

  const onPlaceSearched = place => setLocation(place)

  const ACTIONS = [
    {
      label: 'Cancel',
      style: { bgcolor: '#8c8c8c' },
      onPress: onClose,
    },
    {
      label: 'Save',
      loading,
      onPress: onSave,
    }
  ]

  return (
    <Modal open={open} title="Add new address" onClose={onClose} actions={ACTIONS}>
      <Grid sx={{ overflowY: 'scroll', height: "30rem" }}>
        <Input
          title="Last Name"
          value={lastName}
          placeholder="eg.Robin"
          onChange={(val) => setLastName(val)}
        />

        <Input
          title="First Name"
          value={firstName}
          placeholder="eg.Robin"
          onChange={(val) => setFirstname(val)}
        />

        <Input
          type="number"
          title="Phone"
          value={phone}
          placeholder="eg.Robin"
          onChange={(val) => setPhone(val)}
        />

        <Checkbox
          title="Set as default"
          checked={isDefault}
          onClick={() => setIsDefault(!isDefault)}
        />

        <Grid container flexDirection="column">
          <Grid item>
            <Typography gutterBottom fontWeight="bold" variant="subtitle2">
              Address
            </Typography>
          </Grid>

          <Grid item>
            <GoogleMap
              height={300}
              location={get(location, 'position', null)}
              // onPlaceSearched={onPlaceSearched}
              onLocationChange={onLocationChange}
            />
          </Grid>
        </Grid>
      </Grid>
    </Modal>
  )
}

export default ModalAddNewAddress
