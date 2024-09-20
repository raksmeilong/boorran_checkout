import React from 'react'
import { Modal, CircularProgress } from '@mui/material'

const style = {
  display: 'flex',
  alignItems: 'center',
  alignContent: 'center',
  justifyContent: 'center',
}

const ModalLoading = ({ open }) => {
  return (
    <Modal open={open} sx={style}>
      <CircularProgress />
    </Modal>
  )
}

export default ModalLoading
