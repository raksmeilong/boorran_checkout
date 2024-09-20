import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Grid, CardMedia, Snackbar, ButtonBase } from '@mui/material'
import { Share, ArrowBackIosNewOutlined } from '@mui/icons-material'

const styles = {
  image: {
    height: 500,
    width: '100%',
    objectFit: 'cover',
    backgroundColor: '#f6f7f9d9',
  },
  buttonWrapper: {
    mt: 3,
    left: 16,
    right: 16,
    display: 'flex',
    position: 'absolute',
    justifyContent: 'space-between',
  },
  iconButton: {
    p: 1,
    fontSize: 18,
    boxShadow: 1,
    borderRadius: 50,
    bgcolor: '#f6f7f9d9',
  },
}

const TopImage = (props) => {
  const { image, sku } = props
  const navigate = useNavigate()

  const [snackbarOpen, setSnackbarOpen] = useState(false)

  const handleSnackbarClose = () => setSnackbarOpen(!snackbarOpen)

  const handleShareClick = () => {
    const url = `${window.location.origin}/products/${sku}`

    navigator.clipboard.writeText(url)

    return setSnackbarOpen(true)
  }

  return (
    <>
      <Grid sx={styles.buttonWrapper}>
        <ButtonBase disableRipple disableTouchRipple onClick={() => navigate(-1)}>
          <ArrowBackIosNewOutlined sx={styles.iconButton} />
        </ButtonBase>

        <ButtonBase disableRipple disableTouchRipple onClick={handleShareClick}>
          <Share sx={styles.iconButton} />
        </ButtonBase>
      </Grid>

      <CardMedia
        alt={sku}
        image={image}
        component="img"
        sx={styles.image}
        onError={(e) => {
          e.target.value = 'https://react.semantic-ui.com/images/wireframe/image.png'
        }}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1000}
        message="Link Copied"
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
    </>
  )
}

export default TopImage
