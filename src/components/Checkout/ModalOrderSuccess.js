/* eslint-disable react/no-unescaped-entities */
/* eslint-disable import/no-unresolved */
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Grid, ButtonBase, Typography } from '@mui/material'
import { CheckCircle } from '@mui/icons-material'
import libphonenumber from 'libphonenumber-js'
import moment from 'moment'
import { isEmpty } from "lodash"

import ProductList from '../ProductList'
import Modal from "../../components/Modal"

import { setActiveTab } from '../../redux/actions/app'
import { updateProfle } from '../../redux/actions/auth'
import { setProductToCart } from '../../redux/actions/cart'

const styles = {
  button: {
    height: 50,
    fontSize: 15,
    width: '100%',
    color: 'white',
    borderRadius: 2,
    bgcolor: '#08024A',
    fontWeight: 'bold',
    justifyContent: 'center',
  },
}

const ModalFooterButton = ({ orderDetail }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const onButtonClick = (type) => {
    if (type === 'view-detail') {
      navigate(`/orders/${orderDetail.data.id}`, {
        state: { backToHome: true }
      })
      dispatch(setActiveTab(''))
    } else {
      navigate('/')
      dispatch(setActiveTab(''))
    }

    window.localStorage.clear()
    dispatch(setProductToCart({}))
  }

  return (
    <Grid>
      <ButtonBase disableTouchRipple sx={styles.button} onClick={() => onButtonClick('continue-shopping')}>
        Continue Shopping
      </ButtonBase>

      <ButtonBase disableTouchRipple sx={[styles.button, { mt: 1, bgcolor: 'gray' }]} onClick={() => onButtonClick('view-detail')}>
        View Detail
      </ButtonBase>
    </Grid>
  )
}

const ModalOrderSuccess = (props) => {
  const {
    name,
    open,
    total,
    address,
    discount,
    subTotal,
    phoneNumber,
    orderDetail,
    productLength,
    shippingPrice,
    paymentMethod,
    paymentOption,
    deliveryMethod,
  } = props

  const dispatch = useDispatch()
  const { data } = useSelector(store => store.auth)

  useEffect(async () => {
    if (isEmpty(data.firstName) && isEmpty(data.lastName)) {
      await dispatch(updateProfle({
        phoneNumber,
        object: {
          firstName: name,
        }
      }))
    }
  }, [])

  const renderTopContent = () => {
    let deliveryTime = ''

    if (deliveryMethod === '2-hour') {
      deliveryTime = 'within 2 hours'
    } else if (deliveryMethod === 'same-day') {
      deliveryTime = `by ${moment().format('DD MMMM YYYY')}`
    } else {
      deliveryTime = `by ${moment().add(1, 'days').format('DD MMMM YYYY')}`
    }

    return (
      <Grid container direction="column" alignItems="center" sx={{ bgcolor: 'white' }}>
        <CheckCircle color="success" sx={{ fontSize: 70 }} />

        <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: 15, mt: 1 }}>
          Thanks for shopping!
        </Typography>

        <Typography variant="subtitle2" sx={{ mx: 2, my: 1 }} align="center">
          We have received your order and getting it ready to be shipped. We will notify you when
          it's on the way!
        </Typography>

        <Typography
          variant="subtitle1"
          sx={{ mx: 2, fontSize: 14, fontWeight: 'bold' }}
          align="center"
        >
          Your order will be delivered {deliveryTime}
        </Typography>
      </Grid>
    )
  }

  const renderOrderedProduct = () => {
    return (
      <div>
        <Typography variant="subtitle1" sx={{ mx: 2, my: 1, fontSize: 14 }}>
          You have ordered {productLength} products
        </Typography>

        <ProductList
          type="checkout"
          total={total}
          discount={discount}
          subTotal={subTotal}
          shippingPrice={shippingPrice}
          deliveryMethod={deliveryMethod}
        />
      </div>
    )
  }

  const renderPaymentMethod = () => {
    const payment =
      paymentMethod === 'cash-on-delivery'
        ? 'Cash on Delivery'
        : `Online Payment via ${paymentOption?.text || 'N/A'}`

    return (
      <div>
        <Typography variant="subtitle1" sx={{ mx: 2, fontSize: 14 }}>
          Payment Method:
        </Typography>

        <Typography variant="subtitle1" sx={{ mx: 2, fontSize: 14, fontWeight: 'bold' }}>
          {payment}
        </Typography>
      </div>
    )
  }

  const renderDelivery = () => {
    const parsedPhoneNumber = libphonenumber(phoneNumber, 'KH')

    return (
      <div>
        <Typography variant="subtitle1" sx={{ mx: 2, fontSize: 14 }}>
          Delivering to:
        </Typography>

        <Typography variant="subtitle1" sx={{ mx: 2, fontSize: 14 }}>
          <strong>Name: {name},</strong>
          <br />
          <strong>Mobile: {parsedPhoneNumber.number}</strong>
          <br />
          {address}
        </Typography>
      </div>
    )
  }

  const renderDeliveryMethod = () => {
    const { name: label } = {
      free: { name: 'FREE One-Day Delivery' },
      '2-hour': { name: `2-Hours Delivery ($ ${shippingPrice})` },
      'same-day': { name: 'Same-Day Delivery ($ 0.99)', value: 'same-day' },
    }[deliveryMethod]

    return (
      <div>
        <Typography variant="subtitle1" sx={{ mx: 2, fontSize: 14 }}>
          Delivery Method:
        </Typography>

        <Typography variant="subtitle1" sx={{ mx: 2, fontSize: 14, fontWeight: 'bold' }}>
          {label}
        </Typography>
      </div>
    )
  }

  return (
    <Modal open={open}>
      <Grid sx={{ overflowY: 'scroll', height: "35rem" }}>
        {renderTopContent()}
        <hr />
        {renderOrderedProduct()}
        <hr style={{ margin: '20px 0px 10px 0px', borderTop: 'dashed 1px' }} />
        {renderPaymentMethod()}
        <hr style={{ margin: '10px 0px 10px 0px', borderTop: 'dashed 1px' }} />
        {renderDeliveryMethod()}
        <hr style={{ margin: '10px 0px 10px 0px', borderTop: 'dashed 1px' }} />
        {renderDelivery()}
        <hr style={{ margin: '10px 0px 30px 0px', borderTop: 'dashed 1px' }} />
      </Grid>

      <ModalFooterButton orderDetail={orderDetail} />
    </Modal>
  )
}

export default ModalOrderSuccess
