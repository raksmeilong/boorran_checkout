import React from "react"
import { Grid, Typography, CircularProgress } from "@mui/material"

const styles = {
  loading: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    display: 'flex',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    bgcolor: 'rgba(0,0,0, 0.2)',
  }
}

const Circular = ({ containerStyles = {} }) => {
  return (
    <Grid
      container
      justifyContent="center"
      sx={{ ...styles.loading, ...containerStyles}}
    >
      <CircularProgress size={30} />
      <Typography fontWeight="bold" sx={{ ml: 2 }}>Loading....</Typography>
    </Grid>
  )
}

export default Circular
