import React from 'react'
import { useDispatch } from "react-redux"
import { useNavigate } from 'react-router-dom'
import { Container, Typography, ButtonBase } from '@mui/material'

import { setActiveTab } from "../../redux/actions/app"

const styles = {
  container: {
    pl: 2,
    pr: 2,
    pt: 9,
    pb: 3,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    height: window.innerHeight,
  },
  button: {
    p: 1,
    mt: 1,
    px: 2,
    color: 'white',
    borderRadius: 1.5,
    fontWeight: 'bold',
    backgroundColor: '#08024A',
  },
}

const Error = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  return (
    <Container disableGutters maxWidth="xs" sx={styles.container}>
      <Typography sx={{ fontWeight: 'bold', fontSize: 60 }}>404</Typography>
      <Typography sx={{ fontWeight: 'bold' }}>Page Not Found</Typography>
      <Typography sx={{ mt: 2, fontSize: 13, color: 'gray' }}>
        The page your are looking for was not found
      </Typography>

      <ButtonBase
        disableRipple
        disableTouchRipple
        sx={styles.button}
        onClick={() => {
          dispatch(setActiveTab(''))
          navigate('/')
        }}
      >
        Back to Home
      </ButtonBase>
    </Container>
  )
}

export default Error
