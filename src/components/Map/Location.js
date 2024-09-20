import React from 'react'
import { IconButton, CircularProgress } from '@mui/material'
import { MyLocation } from '@mui/icons-material'

const buttonStyle = {
  left: 10,
  bottom: 30,
  bgcolor: 'white',
  position: 'absolute',
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
}

const Location = ({ loading, onGpsClick }) => {
  return (
    <IconButton
      size="medium"
      disableRipple
      sx={buttonStyle}
      disabled={loading}
      onClick={onGpsClick}
    >
      {loading ? <CircularProgress size={25} color="primary" /> : <MyLocation fontSize="20" />}
    </IconButton>
  )
}

export default Location
