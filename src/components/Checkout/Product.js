import React, { useState } from 'react'
import { Box, Grid, Typography, ButtonBase } from '@mui/material'
import { Add, Remove } from '@mui/icons-material'

import ModalImage from './ModalImage'
import ModalVariant from './ModalVariant'
import DialogRemove from './DialogRemove'

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
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
}

const Product = ({ product, products, onVariantChange, onProductQuantity, onRemoveProduct }) => {
  const productId = product.itemId
  const available = product.available
  const quantity = product.quantity

  const name = product.productName.title
  const variantName = product.title
  const price = product.price
  const total = (product.price * quantity).toFixed(2)
  const image = product.image?.source || 'https://react.semantic-ui.com/images/wireframe/image.png'

  const [openModal, setOpenModal] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [openModalVariant, setOpenModalVariant] = useState(false)

  const onProductIncrease = () => {
    if (quantity < available) {
      onProductQuantity(productId, 'increase')
    }
  }

  const onProductDecrease = () => {
    if (quantity !== 1) {
      onProductQuantity(productId, 'decrease')
    } else {
      handleDialogActions()
    }
  }

  const onImagePress = () => setOpenModal(!openModal)

  const handleDialogActions = () => setOpenDialog(!openDialog)

  const onDialogConfirm = () => onRemoveProduct(productId)

  const onVariantDismiss = (payload) => {
    if (payload) {
      onVariantChange(payload)
    }

    return setOpenModalVariant(false)
  }

  return (
    <Box sx={styles.wrapper}>
      <Grid item sx={styles.leftWrapper} xs={9}>
        <Grid item sx={{ marginRight: 1 }}>
          <img
            src={image}
            loading="lazy"
            alt={`${name}-img`}
            style={{ width: 60 }}
            onClick={onImagePress}
          />
        </Grid>

        <Grid item>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            {name}
          </Typography>

          <Typography variant="subtitle2" sx={{ fontSize: 12, marginBottom: 1, fontWeight: '500' }}>
            {variantName}
          </Typography>

          <Grid container={true}>
            <Typography variant="subtitle2" sx={{ marginRight: 1, fontWeight: '500' }}>
              $ {price}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item sx={styles.rightWrapper}>
        {/* <ButtonBase
          disableRipple={true}
          onClick={() => setOpenModalVariant(true)}
          sx={{ bgcolor: '#08024A', borderRadius: 2 }}
        >
          <Typography variant="subtitle2" sx={{ color: 'white' }}>
            Options
          </Typography>
        </ButtonBase> */}

        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 'bold', alignSelf: 'center', fontSize: 15 }}
        >
          $ {total}
        </Typography>

        <Grid item sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <ButtonBase
            sx={{ bgcolor: '#08024a', p: 0.5, borderRadius: 2 }}
            onClick={onProductDecrease}
          >
            <Remove sx={{ color: 'white', fontSize: 15 }} />
          </ButtonBase>

          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 'bold', fontSize: 15, width: 25 }}
            align="center"
          >
            {quantity}
          </Typography>

          <ButtonBase
            sx={{ bgcolor: '#08024a', p: 0.5, borderRadius: 2 }}
            onClick={onProductIncrease}
          >
            <Add sx={{ color: 'white', fontSize: 15 }} />
          </ButtonBase>
        </Grid>
      </Grid>

      {openModalVariant ? (
        <ModalVariant
          product={product}
          products={products}
          open={openModalVariant}
          productId={product.productId}
          handleClose={onVariantDismiss}
        />
      ) : null}

      <ModalImage image={image} open={openModal} handleClose={onImagePress} />

      <DialogRemove
        open={openDialog}
        onConfirm={onDialogConfirm}
        handleClose={handleDialogActions}
      />
    </Box>
  )
}
export default Product
