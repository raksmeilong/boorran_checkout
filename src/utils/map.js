/* eslint-disable import/no-anonymous-default-export */
import Geocode from 'react-geocode'
import find from 'lodash/find'
import { GOOGLE_API_KEY } from '../redux/config'

import Format from './format'

Geocode.setApiKey(GOOGLE_API_KEY)

const getGeocodeFromLatLng = async ({ lat, lng }) => {
  const response = await Geocode.fromLatLng(lat, lng)
  const LOCATION_TYPES = ['APPROXIMATE', 'GEOMETRIC_CENTER']

  const nearestAddress = find(
    response.results,
    (result) =>
      LOCATION_TYPES.includes(result.geometry.location_type) &&
      !result.formatted_address.includes('+') &&
      !result.formatted_address.includes('Unnamed Road')
  )

  const addressComponents = nearestAddress.address_components
  const state = find(
    addressComponents,
    (component) => component.types[0] === 'administrative_area_level_1'
  )
  const address = Format.locationName(addressComponents, state)

  return { address, city: state.long_name, position: { lat, lng } }
}

const serializeAutocomplete = (place, placeName) => {
  const address = placeName || place.formatted_address
  const addressComponents = place.address_components

  const state = find(
    addressComponents,
    (component) => component.types[0] === 'administrative_area_level_1'
  )

  const lat = place.geometry.location.lat()
  const lng = place.geometry.location.lng()

  return { address, city: state.long_name, position: { lat, lng } }
}

const getCurrentPosition = () =>
  new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition((position) => {
      resolve({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      })
    })
  })

const getCurrentLocation = async () => {
  if (navigator.permissions && navigator.permissions.query) {
    const permission = await navigator.permissions.query({ name: 'geolocation' })

    if (permission.state === 'denied') throw new Error('Allow Boorran.com location to access your current location')

    return await getCurrentPosition()
  } else if (navigator.geolocation) {
    return await getCurrentPosition()
  } else {
    throw new Error('Your device not support GPS, Please manually pin the location and address')
  }
}

export default {
  serializeAutocomplete,
  getGeocodeFromLatLng,
  getCurrentPosition,
  getCurrentLocation
}
