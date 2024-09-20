/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
import React from 'react'
import { useQuery } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Grid, Paper } from '@mui/material'

import map from 'lodash/map'
import uniq from 'lodash/uniq'
import isEmpty from 'lodash/isEmpty'

import Product from './components/Product'
import PaymentSummary from './components/PaymentSummary'
import { setProductToCart, removeProductFromCart } from '../../redux/actions/cart'
import { setActiveTab } from '../../redux/actions/app'

import { GET_DISCOUNT_BY_PRODUCT_IDS } from '../../config/query'

const styles = {
  productListing: {
    p: 3,
    display: 'flex',
    borderRadius: 2,
    flexDirection: 'column',
  },
  seperator: {
    width: '100%',
    marginTop: 0,
    marginBottom: 2,
    bgcolor: '#a1a3bbd9',
    border: '1px solid #a1a3bbd9',
  },
}

const ProductListing = (props) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {
    type,
    total,
    subTotal,
    discount,
    setSnackbar,
    deliveryMethod,
    shippingPrice = 0,
    displaySavingInfo,
    handleDiscountInfo,
    products = null,
    containerStyles = {}
  } = props

  const { cart: { cart } } = useSelector((store) => store)

  const productIds = uniq(Object.values(cart).map(variant => variant.productId))
  const { data: discountDetail } = useQuery(GET_DISCOUNT_BY_PRODUCT_IDS, { variables: { productIds } })

  const onDeleteItem = async (variantId) => {
    const newCart = { ...cart }

    delete newCart[variantId]

    dispatch(removeProductFromCart(newCart))

    if (isEmpty(newCart)) {
      dispatch(setActiveTab(''))
      navigate('/')
    }
  }

  const onQuantityChange = (type, variantId) => {
    let newCart = {}

    const { stock } = cart[variantId]
    const currentQuantity = cart[variantId].quantity

    const isValidIncrement = currentQuantity < stock
    const isValidDecrement = currentQuantity - 1 !== 0

    if (type === 'decrement' && !isValidDecrement) return null

    if (type === 'increment' && !isValidIncrement) return setSnackbar(true)

    if (type === 'increment' && isValidIncrement) {
      newCart = {
        ...cart,
        [variantId]: {
          ...cart[variantId],
          quantity: cart[variantId].quantity + 1,
        },
      }
    } else if (isValidDecrement) {
      newCart = {
        ...cart,
        [variantId]: {
          ...cart[variantId],
          quantity: cart[variantId].quantity - 1,
        },
      }
    }

    dispatch(setProductToCart(newCart))
  }

  return (
    <Paper sx={{ ...styles.productListing, ...containerStyles}}>
      {map((products || cart), (product, key) => {
        return (
          <React.Fragment key={key}>
            <Product
              type={type}
              product={product}
              onDeleteItem={onDeleteItem}
              onQuantityChange={onQuantityChange}
              discountData={discountDetail?.boorran_Discounts || []}
            />
          </React.Fragment>
        )
      })}

      <Grid sx={styles.seperator} />

      <PaymentSummary
        type={type}
        total={total}
        subTotal={subTotal}
        discount={discount}
        shippingPrice={shippingPrice}
        deliveryMethod={deliveryMethod}
        displaySavingInfo={displaySavingInfo}
        handleDiscountInfo={handleDiscountInfo}
      />
    </Paper>
  )
}

export default ProductListing
