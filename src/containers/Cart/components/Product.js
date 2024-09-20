import React, { useState } from 'react'
import { Box, Grid, Typography, ButtonBase } from '@mui/material'
import { Add, Remove, DeleteOutline } from '@mui/icons-material'

import ModalImage from '../../../components/Checkout/ModalImage'
import ModalRemoveItem from '../../../components/Checkout/DialogRemove'

const styles = {
  wrapper: {
    display: 'flex',
    marginBottom: 2,
    flexDirection: 'row',
  },
  leftWrapper: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  rightWrapper: {
    my: 0.5,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  button: {
    p: 0.5,
    borderRadius: 2,
    bgcolor: '#08024a',
  },
  icon: {
    fontSize: 15,
    color: 'white',
  },
  removeProduct: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}

const Product = ({ product, onDeleteItem, onQuantityChange }) => {
  const name = product.productName
  const price = Number(product.price)
  const quantity = product.quantity

  const variantId = product.variant.id
  const variantName = product.variant.title
  const total = (price * quantity).toFixed(2)

  const image = product?.image || 'https://via.placeholder.com/60x60'

  const [openModal, setOpenModal] = useState(false)
  const [openModalRemoveItem, setModalRemoveItem] = useState(false)

  const onImagePress = () => setOpenModal(!openModal)

  const onModalRemoveItemConfirm = () => onDeleteItem(variantId)

  const handleModalRemoveItemActions = () => setModalRemoveItem(!openModalRemoveItem)

  return (
    <Box sx={styles.wrapper}>
      <Grid item sx={styles.leftWrapper} xs={9}>
        <Grid item sx={{ marginRight: 1 }}>
          <img
            width={60}
            height={80}
            src={image}
            loading="lazy"
            alt={`${name}-img`}
            onClick={setOpenModal}
            style={{ objectFit: 'cover' }}
          />
        </Grid>

        <Grid item>
          <Typography variant="subtitle2" sx={{ fontSize: 12, fontWeight: 'bold' }}>
            {name}
          </Typography>

          <Typography variant="subtitle2" sx={{ fontSize: 10, marginBottom: 1 }}>
            {variantName}
          </Typography>

          <Grid container={true}>
            <Typography variant="subtitle2" sx={{ fontSize: 13 }}>
              $ {price}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item sx={styles.rightWrapper}>
        <Grid sx={styles.removeProduct}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', fontSize: 13, ml: 0.5 }}>
            $ {total}
          </Typography>

          <ButtonBase disableRipple onClick={handleModalRemoveItemActions}>
            <DeleteOutline sx={{ fontSize: 20 }} />
          </ButtonBase>
        </Grid>

        <Grid item sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <ButtonBase sx={styles.button} onClick={() => onQuantityChange('decrement', variantId)}>
            <Remove sx={styles.icon} />
          </ButtonBase>

          <Typography variant="subtitle2" sx={{ fontSize: 13, width: 25 }} align="center">
            {quantity}
          </Typography>

          <ButtonBase sx={styles.button} onClick={() => onQuantityChange('increment', variantId)}>
            <Add sx={styles.icon} />
          </ButtonBase>
        </Grid>
      </Grid>

      <ModalRemoveItem
        open={openModalRemoveItem}
        onConfirm={onModalRemoveItemConfirm}
        handleClose={handleModalRemoveItemActions}
      />

      <ModalImage image={image} open={openModal} handleClose={onImagePress} />
    </Box>
  )
}

export default Product
