import React, { useState } from 'react'
import { Box, Grid, Typography, ButtonBase } from '@mui/material'
import { Add, Remove, DeleteOutline } from '@mui/icons-material'

import get from 'lodash/get'
import find from 'lodash/find'

import utils from '../../../utils'

import Modal from "../../Modal"
import ModalImage from '../../Checkout/ModalImage'

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
    flex: 1,
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
  row: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  discount: {
    mr: 1,
    color: 'gray',
    fontSize: 13,
    textDecoration: 'line-through',
  },
}

const Product = ({ type, discountData, product, onDeleteItem, onQuantityChange }) => {
  const name = product.productName
  const { quantity } = product
  const price = Number(product.price)

  const productId = get(product, 'productId')
  const variantId = get(product, 'variant.id', '').split('/')[4] || null
  const variantName = get(product, 'variant.title', '')

  const productDiscount = discountData
    ? find(discountData, datum => datum.productId.itemId === productId)
    : {}

  const isVariantDiscount = get(productDiscount, 'variantIds', []).includes(variantId)

  const discountPrice = isVariantDiscount
    ? utils.helpers.calculateDiscountPrice(productDiscount.type, productDiscount.amount, Number(price || 0))
    : 0

  const total = isVariantDiscount
    ? (discountPrice * quantity).toFixed(2)
    : (price * quantity).toFixed(2)

  const image = get(product, 'image', 'https://via.placeholder.com/60x60')

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

          <Grid container>
            {discountPrice ? (
              <Grid sx={styles.row}>
                <Typography variant="subtitle2" sx={styles.discount}>
                  $ {price}
                </Typography>

                <Typography
                  variant="subtitle2"
                  sx={{ fontSize: 13, color: 'red', fontWeight: 'bold' }}
                >
                  $ {discountPrice.toFixed(2)}
                </Typography>
              </Grid>
            ) : (
              <Typography variant="subtitle2" sx={{ fontSize: 13 }}>
                $ {price}
              </Typography>
            )}

            {type === 'checkout' && (
              <Typography variant="subtitle2" sx={{ fontSize: 13, ml: 1 }}>
                x {quantity}
              </Typography>
            )}
          </Grid>
        </Grid>
      </Grid>

      <Grid item sx={styles.rightWrapper}>
        {type !== 'checkout' ? (
          <>
            <Grid sx={styles.removeProduct}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', fontSize: 14, ml: 0.5 }}>
                $ {total}
              </Typography>

              <ButtonBase disableRipple onClick={handleModalRemoveItemActions}>
                <DeleteOutline sx={{ fontSize: 20 }} />
              </ButtonBase>
            </Grid>

            <Grid item sx={styles.row}>
              <ButtonBase
                sx={styles.button}
                onClick={() => onQuantityChange('decrement', variantId)}
              >
                <Remove sx={styles.icon} />
              </ButtonBase>

              <Typography
                variant="subtitle2"
                sx={{ fontSize: 13, fontWeight: 'bold' }}
                align="center"
              >
                {quantity}
              </Typography>

              <ButtonBase
                sx={styles.button}
                onClick={() => onQuantityChange('increment', variantId)}
              >
                <Add sx={styles.icon} />
              </ButtonBase>
            </Grid>
          </>
        ) : (
          <Grid
            sx={{
              display: 'flex',
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 'bold',
                fontSize: 15,
                ml: 0.5,
                color: '#08024a',
              }}
            >
              $ {total}
            </Typography>
          </Grid>
        )}
      </Grid>

      <Modal
        title="Are you sure to remove this Product?"
        open={openModalRemoveItem}
        onClose={handleModalRemoveItemActions}
        actions={[
          {
            label: 'No',
            style: { bgcolor: '#8c8c8c' },
            onPress: handleModalRemoveItemActions,
          },
          {
            label: 'Yes',
            onPress: onModalRemoveItemConfirm,
          }
        ]}
      />

      <ModalImage image={image} open={openModal} handleClose={onImagePress} />
    </Box>
  )
}

export default Product
