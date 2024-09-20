import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Grid, Container, ButtonBase } from '@mui/material'

const styles = {
  wrapper: {
    bottom: 0, //Change to 60
    height: 80,
    width: '100%',
    display: 'flex',
    position: 'fixed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
  },
  button: {
    pr: 2,
    pl: 2,
    height: 50,
    fontSize: 15,
    width: '100%',
    color: 'white',
    borderRadius: 2,
    bgcolor: '#08024A',
    fontWeight: 'bold',
    justifyContent: 'center',
  },
}

const Footer = () => {
  const navigate = useNavigate()

  const onCheckoutPress = () => navigate('/checkout')

  return (
    <Grid item sx={styles.wrapper}>
      <Container maxWidth="xs">
        <ButtonBase sx={styles.button} onClick={onCheckoutPress}>
          Checkout
        </ButtonBase>
      </Container>
    </Grid>
  )
}

export default Footer