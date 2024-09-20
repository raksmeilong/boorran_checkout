/* eslint-disable no-undef */
import React, { useState, useRef, useEffect } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { Wrapper } from '@googlemaps/react-wrapper'
import { GOOGLE_API_KEY } from '../../redux/config'
import { createCustomEqual } from 'fast-equals'
import utils from '../../utils'

import Marker from './Marker'
import Location from './Location'
import Autocomplete from './Autocomplete'

const GoogleMap = ({
  height,
  location,
  readOnly = false,
  onPlaceSearched = null,
  autoCompleteValue = null,
  onLocationChange = null,
}) => {
  const [zoom, setZoom] = useState(15)
  const [loading, setLoading] = useState(false)
  const [center, setCenter] = useState(location || utils.constants.defaultLocation)

  // useEffect(() => {
  //   getCurrentLocation()

  useEffect(() => {
    if (!readOnly) {
      getCurrentLocation()

      return () => getCurrentLocation()
    }
  }, [])

  const onIdle = (m) => {
    setCenter(m.getCenter().toJSON())
    setZoom(m.getZoom())
  }

  const onPlaceSelected = (place) => {
    if (onPlaceSearched) onPlaceSearched(place)

    setCenter(place.position)
  }

  const getCurrentLocation = async () => {
    try {
      setLoading(true)

      const location = await utils.map.getCurrentLocation()

      setCenter(location)
      onLocationChange(location)

      setLoading(false)
    } catch (err) {
      setLoading(false)
      alert(err.message)
    }
  }

  return (
    <div style={{ display: 'flex', height: '100%', position: 'relative' }}>
      <Wrapper apiKey={GOOGLE_API_KEY}>
        <Map
          readOnly={readOnly}
          scrollwheel={!readOnly}
          zoomControl={!readOnly}
          fullscreenControl={!readOnly}
          gestureHandling={!readOnly ? "greedy" : "none"}
          center={center}
          autoCompleteValue={autoCompleteValue}
          onClick={(e) => onLocationChange({ lat: e.latLng.lat(), lng: e.latLng.lng() })}
          onIdle={onIdle}
          zoom={zoom}
          style={{ flexGrow: 1, height: height || 400 }}
          streetViewControl={false}
          mapTypeControl={false}
          onPlaceSearched={onPlaceSearched && onPlaceSelected}
        >
          {location && <Marker position={location} />}
          {!readOnly && <Location loading={loading} onGpsClick={getCurrentLocation} />}
        </Map>
      </Wrapper>

      {loading && (
        <Box
          sx={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(0, 0, 0, 0.2)',
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </div>
  )
}

const Map = ({ readOnly, autoCompleteValue, onClick, onIdle, children, style, onPlaceSearched, ...options }) => {
  const mapRef = useRef(null)

  const [map, setMap] = useState()

  useEffect(() => {
    if (mapRef.current && !map) {
      setMap(new window.google.maps.Map(mapRef.current, {}))
    }
  }, [mapRef, map])

  useEffect(() => {
    if (map) {
      ['click', 'idle'].forEach((eventName) => google.maps.event.clearListeners(map, eventName))

      if (onClick) {
        map.addListener('click', onClick)
      }

      if (onIdle) {
        map.addListener('idle', () => onIdle(map))
      }
    }
  }, [map, onClick, onIdle])

  useDeepCompareEffectForMaps(() => {
    if (map) map.setOptions(options)
  }, [map, options])

  return (
    <>
      <div ref={mapRef} style={style} />
      {(!readOnly && onPlaceSearched) && <Autocomplete onPlaceSelected={onPlaceSearched} value={autoCompleteValue} />}

      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // set the map prop on the child component
          return React.cloneElement(child, { map })
        }

        return null
      })}
    </>
  )
}

const deepCompareEqualsForMaps = createCustomEqual((deepEqual) => (a, b) => deepEqual(a, b))
const useDeepCompareMemoize = (value) => {
  const ref = React.useRef()

  if (!deepCompareEqualsForMaps(value, ref.current)) ref.current = value

  return ref.current
}

const useDeepCompareEffectForMaps = (callback, dependencies) =>
  React.useEffect(callback, dependencies.map(useDeepCompareMemoize))

export default GoogleMap
