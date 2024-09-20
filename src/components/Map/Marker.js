import { useState, useEffect } from 'react'

const Marker = (options) => {
  const [marker, setMarker] = useState()

  useEffect(() => {
    if (!marker) {
      // eslint-disable-next-line no-undef
      setMarker(new google.maps.Marker())
    }

    return () => {
      if (marker) {
        marker.setMap(null)
      }
    }
  }, [marker])

  useEffect(() => {
    if (marker) {
      marker.setOptions(options)
    }
  }, [marker, options])

  return null
}

export default Marker
