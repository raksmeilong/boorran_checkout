import React from 'react'
import { Box, Modal, Typography } from '@mui/material'

const styles = {
  body: {
    top: '50%',
    left: '50%',
    width: '50%',
    bgcolor: 'white',
    borderRadius: 2,
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
  },
  text: {
    fontSize: 13,
  },
}

const ModalSaveInfo = ({ open, discount, handleClose, onlinePaymentDiscount }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={styles.body} p={2}>
        {discount > 0 && (
          <Typography sx={styles.text}>
            Discount on Products: $
            {onlinePaymentDiscount && (discount - onlinePaymentDiscount).toFixed(2)}
          </Typography>
        )}

        <Typography sx={styles.text}>
          Online Payment Discount: ${onlinePaymentDiscount && onlinePaymentDiscount}
        </Typography>
      </Box>
    </Modal>
  )
}

export default ModalSaveInfo
