import React from 'react'
import { Modal, Box } from '@mui/material'

const style = {
  top: '50%',
  left: '50%',
  bgcolor: 'white',
  borderRadius: 2,
  position: 'absolute',
  transform: 'translate(-50%, -50%)',
}

const ModalImage = ({ image, open, handleClose }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style} p={2}>
        <img src={image} alt="modal-img" loading="lazy" style={{ width: 200 }} />
      </Box>
    </Modal>
  )
}

export default ModalImage
