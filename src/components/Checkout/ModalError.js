import React from 'react'
import { Modal, Container, Grid, Typography } from '@mui/material'
import { ReportGmailerrorred } from '@mui/icons-material'

const modalStyle = {
  top: '50%',
  left: '50%',
  width: '85%',
  borderRadius: 2,
  bgcolor: 'white',
  position: 'absolute',
  transform: 'translate(-50%, -50%)',
}

const ModalNotFound = ({ open, onClose }) => {
  const errorMessage = open

  return (
    <Modal open={open} onClose={onClose}>
      <Container maxWidth="xs" sx={modalStyle}>
        <Grid
          container={true}
          direction={'column'}
          alignItems={'center'}
          sx={{ paddingTop: 5, paddingBottom: 2 }}
        >
          <ReportGmailerrorred color="warning" sx={{ fontSize: 50, marginBottom: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: 18 }}>
            {errorMessage || 'Something went wrong'}
          </Typography>
        </Grid>
        <Grid container={true} p={1} />
      </Container>
    </Modal>
  )
}

export default ModalNotFound
