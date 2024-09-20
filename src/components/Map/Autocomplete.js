import React, { useEffect } from 'react'
import { usePlacesWidget } from 'react-google-autocomplete'
import { GOOGLE_API_KEY } from '../../redux/config'
import utils from '../../utils'

const autocompleteStyles = {
  borderColor: 'transparent',
  width: 'calc(100% - 70px)',
  boxSizing: 'border-box',
  borderRadius: '3px',
  fontSize: '14px',
  outline: 'none',
  left: 10,
  height: 40,
  padding: 10,
  marginTop: 10,
  position: 'absolute',
  textOverflow: 'ellipses',
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
}

const Autocomplete = ({ placeholder = null, value = null, onPlaceSelected, style = {} }) => {
  useEffect(() => {
    if (placeholder) {
      document.getElementById('autocomplete').setAttribute('placeholder', placeholder)
    }
  }, [placeholder])

  const { ref } = usePlacesWidget({
    apiKey: GOOGLE_API_KEY,
    onPlaceSelected: (place, inputRef) =>
      onPlaceSelected(utils.map.serializeAutocomplete(place, inputRef.value)),
    options: {
      types: ['geocode', 'establishment'],
      componentRestrictions: { country: 'kh' },
    },
  })

  return <input id="autocomplete" ref={ref} style={{ ...autocompleteStyles, ...style }} defaultValue={value} />
}

export default Autocomplete
