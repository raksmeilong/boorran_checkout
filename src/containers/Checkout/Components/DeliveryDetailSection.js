/* eslint-disable no-shadow */
import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Grid,
  Paper,
  Radio,
  InputBase,
  Typography,
  RadioGroup,
  ButtonBase,
  FormControlLabel,
} from '@mui/material'
import { MultipleStop } from "@mui/icons-material"

import utils from '../../../utils'
import GoogleMap from '../../../components/Map'
import Navigate from "../../../components/Navigate"
import Autocomplete from '../../../components/Map/Autocomplete'

const styles = {
  wrapper: {
    mt: 3,
    mb: 2,
    display: 'flex',
  },
  iconButton: {
    p: 1,
    mr: 2,
    fontSize: 30,
    boxShadow: 1,
    borderRadius: 50,
    bgcolor: '#f6f7f9d9',
  },
  information: {
    p: 3,
    display: 'flex',
    borderRadius: 2,
    flexDirection: 'column',
  },
  inputBase: {
    px: 1,
    fontSize: 13,
    width: '100%',
    minHeight: 35,
    borderRadius: 1,
    border: '1px solid lightgray',
  },
  autocomplete: {
    width: '100%',
    marginLeft: -10,
    boxShadow: 'none',
    position: 'relative',
    borderRadius: '3px',
    border: '1px solid rgba(0, 0, 0, 0.3)',
  },
  SelectSavedAddress: {
    py: 1,
    mb: 2,
    color: 'white',
    borderRadius: 2,
    bgcolor: '#08024A',
    textAlign: 'center',
  }
}

const DeliveryDetailSection = (props) => {
  const {
    name,
    note,
    address,
    location,
    province,
    phoneNumber,

    setNote,
    setName,
    setState,
    setAddress,
    setLocation,
    setProvince,
    setPhoneNumber,
    setPaymentMethod,
  } = props

  const navigate = useNavigate()

  const onBackClick = () => navigate(-1)

  const onPlaceSearched = (place) => {
    const address = utils.format.sliceLocationName(place.address)

    setState(place.city)
    setLocation(place.position)
    setAddress(address || 'N/A')
  }

  const onLocationChange = async (newLocation) => {
    const place = await utils.map.getGeocodeFromLatLng(newLocation)

    onPlaceSearched(place)
  }

  const renderNameInput = () => {
    return (
      <Grid sx={{ mb: 1.5 }}>
        <Typography gutterBottom variant="subtitle2" sx={{ fontWeight: 'bold' }}>
          Name
        </Typography>

        <InputBase
          value={name || ''}
          sx={styles.inputBase}
          placeholder=" Your name"
          onChange={(e) => setName(e.target.value)}
        />
      </Grid>
    )
  }

  const renderPhoneNumber = () => {
    return (
      <Grid sx={{ mb: 1.5 }}>
        <Typography gutterBottom variant="subtitle2" sx={{ fontWeight: 'bold' }}>
          Phone Number
        </Typography>

        <InputBase
          sx={styles.inputBase}
          value={phoneNumber || ''}
          placeholder=" Your phone number"
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </Grid>
    )
  }

  const renderStateRadio = () => {
    return (
      <Grid sx={{ mb: 0.5 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
          State
        </Typography>

        <RadioGroup
          aria-label="location"
          value={province || ''}
          name="state-radio-button-group"
          sx={{ flexDirection: 'row' }}
          onChange={(e) => {
            if (e.target.value === 'province') {
              setPaymentMethod('online-payment')
            }

            setProvince(e.target.value)
          }}
        >
          <FormControlLabel
            value="phnom-penh"
            control={<Radio />}
            label={<Typography sx={{ fontSize: 14 }}>Phnom Penh</Typography>}
          />
          <FormControlLabel
            value="province"
            control={<Radio />}
            label={<Typography sx={{ fontSize: 14 }}>Province</Typography>}
          />
        </RadioGroup>
      </Grid>
    )
  }

  const renderLocationInput = () => {
    return (
      <Grid sx={{ mb: 1.5 }}>
        <Typography gutterBottom variant="subtitle2" sx={{ fontWeight: 'bold' }}>
          Location
        </Typography>

        <GoogleMap
          location={location}
          autoCompleteValue={address || ''}
          onPlaceSearched={onPlaceSearched}
          onLocationChange={onLocationChange}
        />
      </Grid>
    )
  }

  const renderAddressInput = () => {
    return (
      <Grid sx={{ mb: 1.5 }}>
        <Typography gutterBottom variant="subtitle2" sx={{ fontWeight: 'bold' }}>
          Address
        </Typography>

        <Autocomplete
          value={address || ''}
          style={styles.autocomplete}
          onPlaceSelected={onPlaceSearched}
          placeholder="Fill in your address"
        />
      </Grid>
    )
  }

  const renderNoteInput = () => {
    return (
      <Grid sx={{ mb: 1.5 }}>
        <Typography gutterBottom variant="subtitle2" sx={{ fontWeight: 'bold' }}>
          Note
        </Typography>

        <InputBase
          multiline
          value={note || ''}
          sx={styles.inputBase}
          placeholder=" Your note"
          onChange={(e) => setNote(e.target.value)}
        />
      </Grid>
    )
  }

  return (
    <>
      <Navigate
        title="Delivery Details"
        subTitle="Please provide your phone number and location"
        iconStyles={{ alignSelf: 'flex-start' }}
      />

      <Paper sx={styles.information}>
        {/* <ButtonBase disableRipple disableTouchRipple sx={styles.SelectSavedAddress}>
          <MultipleStop sx={{ fontSize: 20, mr: 1 }} />
          <Typography fontWeight="bold" fontSize={14}>
            Choose address
          </Typography>
        </ButtonBase> */}

        {renderNameInput()}
        {renderPhoneNumber()}
        {renderStateRadio()}
        {renderLocationInput()}
        {renderAddressInput()}
        {renderNoteInput()}
      </Paper>
    </>
  )
}

export default DeliveryDetailSection
