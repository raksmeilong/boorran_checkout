/* eslint-disable no-nested-ternary */
/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable no-promise-executor-return */
/* eslint-disable consistent-return */
import React, { useRef, useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { useSelector } from 'react-redux'
import { Grid, Container, Snackbar, CircularProgress } from '@mui/material'
import libphonenumber from 'libphonenumber-js'
import moment from 'moment'

import get from 'lodash/get'
import find from 'lodash/find'
import uniq from 'lodash/uniq'
import size from 'lodash/size'
import reduce from 'lodash/reduce'
import isEqual from 'lodash/isEqual'

import utils from '../../utils'
import Modules from '../../modules'

import Footer from './Components/Footer'

import PaymentSection from './Components/PaymentSection'
import OrderSummarySection from './Components/OrderSummarySection'
import DeliveryMethodSection from './Components/DeliveryMethodSection'
import DeliveryDetailSection from './Components/DeliveryDetailSection'

import ModalPayment from '../../components/Checkout/ModalPayment'
import ModalLoading from '../../components/Checkout/ModalLoading'
import ModalSaveInfo from '../../components/Checkout/ModalSaveInfo'
import ModalOrderSuccess from '../../components/Checkout/ModalOrderSuccess'

import { ABA_PAYWAY_MERCHANT_ID } from '../../redux/config'
import { updateOrderPayment, createOrder, calculateDeliveryFee } from '../../redux/actions/checkout'

import { GET_CONFIGS, GET_DISCOUNT_BY_PRODUCT_IDS } from '../../config/query'

const styles = {
  container: {
    pl: 2,
    pt: 7,
    pr: 2,
    pb: 15,
  },
  loading: {
    top: 0,
    left: 0,
    flex: 1,
    right: 0,
    bottom: 0,
    zIndex: 1,
    display: 'flex',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    bgcolor: 'rgba(0,0,0, 0.2)',
  },
}

const Checkout = () => {
  const receiptRef = useRef()

  const { cart: { cart }, auth: { data } } = useSelector((store) => store)

  const defaultAddress = get(data, 'defaultAddress[0]', null)
  const defaultAddressCity = get(defaultAddress, 'city', '')
  const defaultAddressName = get(defaultAddress, 'address', '')
  const defaultLocation = defaultAddress && defaultAddress.location
  ?
    {
      lat: Number(defaultAddress.location.split(',')[0]),
      lng: Number(defaultAddress.location.split(',')[1])
    }
  : utils.constants.defaultLocation

  const lastName = defaultAddress?.lastName || data?.lastName || ''
  const firstName = defaultAddress?.firstName || data?.firstName || ''

  const profileName = `${lastName} ${firstName}`.trim() || null
  const profilePhone = defaultAddress?.phone || data?.phone || null
  const profileEmail = data?.email || null

  const [name, setName] = useState(profileName)
  const [state, setState] = useState(defaultAddressCity)
  const [address, setAddress] = useState(defaultAddressName)

  const [phoneNumber, setPhoneNumber] = useState(profilePhone)
  const [receiptData, setReceiptData] = useState(null)
  const [paymentOption, setPaymentOption] = useState(null)

  const [province, setProvince] = useState('phnom-penh')
  const [shippingPrice, setShippingPrice] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState('cash-on-delivery')

  const [snackbar, setSnackbar] = useState()
  const [snackbarText, setSnackbarText] = useState('')
  const [location, setLocation] = useState(defaultLocation)

  const [loading, setLoading] = useState(false)
  const [orderDetail, setOrderDetail] = useState(null)
  const [orderSuccess, setOrderSuccess] = useState(false)

  const [note, setNote] = useState('')
  const [openInfo, setOpenInfo] = useState(false)
  const [deliveryMethod, setDeliveryMethod] = useState('2-hour')

  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [openPayment, setOpenPayment] = useState(false)

  const [time, setTime] = useState(null)
  const [pendingTxnId, setPendingTxnId] = useState(null)

  const productIds = uniq(Object.values(cart).map(variant => variant.productId))

  const {
    data: discountDetail,
    loading: loadingDiscount
  } = useQuery(GET_DISCOUNT_BY_PRODUCT_IDS, { variables: { productIds } })

  const {
    loading: loadingConfigs,
    data: configsData
  } = useQuery(GET_CONFIGS)

  const onlinePaymentDiscountConfig = configsData?.discountOnlinePayment[0].metadata || {}
  const paymentMethodsConfig = configsData?.paymentMethods.filter(method => method.metadata && method.metadata.isBank && method.metadata.logo) || {}
  const storeConfig = configsData && configsData.deliveryConfigs ? find(configsData.deliveryConfigs, config => config.key === 'delivery').value.storeFront : {}

  const { subTotal, discount, total, onlinePaymentDiscount } = utils.helpers.sumCartSubTotal(cart, discountDetail, onlinePaymentDiscountConfig, paymentMethod)

  const finalShippingPrice =
    deliveryMethod === 'same-day'
      ? Number(storeConfig.sameDayFee).toFixed(2)
      : deliveryMethod === 'free'
      ? 0
      : (Number(shippingPrice) + Number(storeConfig.twoHoursFee)).toFixed(2)

  const finalDiscount = Number(discount)
  const finalTotal = (Number(total) + Number(finalShippingPrice)).toFixed(2)

  const abaCheckoutElement = document.getElementById('aba-checkout')
  const abaCheckoutApp = document.getElementById('aba_checkout_sheet')

  const abaPaywayModalOpen = abaCheckoutElement
    ? abaCheckoutElement.getElementsByClassName('aba-checkout-modal-container').length > 0
    : false

  const abaPaywayModalAppOpen = abaCheckoutApp
    ? abaCheckoutApp.getAttribute('aria-hidden')
    : false

  useEffect(() => {
    realtimeClock()
  }, [])

  const realtimeClock = () => {
    setTime(Number(moment().format('x')))
    setTimeout(realtimeClock, 1000)
  }

  useEffect(() => {
    const validatePaidPayment = async () => {
      try {
        const req = await Modules.payment.checkTransactionABAKhqr({
          merchantId: ABA_PAYWAY_MERCHANT_ID,
          transactionId: pendingTxnId
        })
        // status 0: approved
        // status 2: pending
        if (req.data.status === 0 && req.data.payment_status === 'APPROVED') {
          await updateOrderPayment({ orderId: orderDetail.data.id })

          setLoading(false)
          return setOrderSuccess(true)
        }

        return () => {
          setSnackbar(true)
          setSnackbarText('Failed Payment. Please try again')
          setLoading(false)
        }
      } catch (err) {
        console.error(err)
        alert(err)
      }
    }

    if ((!abaPaywayModalOpen || !abaPaywayModalAppOpen) && pendingTxnId) {
      return validatePaidPayment()
    }

    return () => {}
  }, [abaPaywayModalOpen || abaPaywayModalAppOpen])

  useEffect(() => {
    window.scrollTo({ top: 0 })

    onLocationChange()
  }, [location])

  const handleDiscountInfo = () => setOpenInfo(!openInfo)

  const handleSnackbarClose = () => setSnackbar(false)

  const onReceiptChange = (event) => {
    const file = event.target.files[0]

    if (file) setReceiptData(event.target.files[0])
  }

  const onLocationChange = async () => {
    if (!location || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
      // Handle the case where location is not properly set
      console.warn('Location is not properly set.')
      return
    }
  
    const isPP = state.match(/ភ្នំពេញ|phnom\s*penh/i)
  
    if (isPP) {
      const { data } = await calculateDeliveryFee(location)
      setShippingPrice(data.deliveryFee)
    } else {
      setShippingPrice(2)
    }
  }

  const getOrderItems = () => {
    return reduce(
      cart,
      (result, product) => {
        const options = reduce(
          product.productOptions,
          (result, option) => {
            result[`${option.name.toLowerCase()}`] = product.variant.selectedOptions[option.position-1].value
            return result
          },
          {}
        )

        result.push({
          ...options,
          price: product.price,
          stock: product.stock,
          quantity: product.quantity,
          title: product.variant.title,
          source: product?.image || null,
          productTitle: product?.productName,
          id: product.variant.id.split('/')[4],
          itemId: product.variant.id.split('/')[4],
          imageId: product?.variant?.image?.id.split('/')[4] || null,
        })

        return result
      },
      []
    )
  }

  const validation = () => {
    return new Promise((resolve, reject) => {
      if (!name || name.length === 0) {
        return reject(Error('Name cannot be blank'))
      }

      if (!phoneNumber || phoneNumber.length === 0) {
        return reject(Error('Phone number cannot be blank'))
      }

      if (
        !libphonenumber(phoneNumber, 'KH') ||
        !libphonenumber(phoneNumber, 'KH').isValid()
      ) {
        return reject(Error('Invalid Phone number'))
      }

      if (!address || address.length === 0) {
        return reject(Error('Address cannot be blank'))
      }

      if (isEqual(location, utils.constants.defaultLocation)) {
        return reject(Error('Please manunally select from map'))
      }

      if (paymentMethod === 'online-payment' && !paymentOption) {
        return reject(Error('Please select payment option'))
      }

      if (
        paymentMethod === 'online-payment' &&
        !receiptData &&
        paymentOption.value !== 'aba_khqr'
      ) {
        return reject(Error('Please upload your bank statement'))
      }

      if (deliveryMethod === '2-hour' && finalShippingPrice === 0) {
        return reject(Error('Please allow location permission'))
      }

      return resolve(true)
    })
  }

  const generateKhqrCodeUrl = async (amount, orderNumber) => {
    try {
      const req = await Modules.payment.generateABAKhqr({
        amount,
        paymentGate: "0",
        viewType: "checkout",
        transactionId: orderNumber,
        ...(name ? { firstName: name } : null),
        ...(phoneNumber ? { phone: phoneNumber } : null),
        ...(profileEmail ? { email: profileEmail } : null)
      })

      setPendingTxnId(req.data.transactionId)
      setQrCodeUrl(req.data.url)

      return true
    } catch (err) {
      alert(err)
    }
  }

  const onBuyNowClick = async () => {
    try {
      await validation()
      setLoading(true)
  
      const isAbaKhqrPayment = paymentOption && paymentOption.value === 'aba_khqr'
      const paymentMethodLabel = utils.helpers.getPaymentMethodLabel(paymentMethod, paymentOption)
  
      // Construct payload
      const payload = {
        note,
        customerName: name,
        customerPlaceName: address,
        customerCity: state || 'N/A',
        paymentMethodLabel,
        orderItems: getOrderItems(),
        shippingPrice: finalShippingPrice,
        deliveryDate: new Date().toISOString(),
        discountPrice: Number(discount.toFixed(2)),
        customerPhone: libphonenumber(phoneNumber, 'KH').number,
        customerLocation: location ? { lat: location.lat, lng: location.lng } : { lat: 0, lng: 0 },
        paymentStatus: 'pending',
        profilePhone: libphonenumber(phoneNumber, 'KH').number,
      }
  
      // Create order
      const order = await createOrder(payload)
      setOrderDetail(order)
  
      if (paymentMethod === 'online-payment' && isAbaKhqrPayment && !pendingTxnId) {
        const { shopifyOrderNumber = null } = order?.data || ''
        await generateKhqrCodeUrl(finalTotal, shopifyOrderNumber)
        return AbaPayway.checkout()
      }
  
      setLoading(false)
      setOrderSuccess(true)
    } catch (err) {
      console.error('Order creation failed:', err)
      setLoading(false)
      setSnackbar(true)
      setSnackbarText('Order creation failed. Please try again later.')
    }
  }
  

  const renderAbaPaywayKhqr = () => (
    <form
      action={qrCodeUrl}
      method="GET"
      id="aba_merchant_request"
      target="aba_webservice"
    />
  )

  return (
    <>
      <Container maxWidth="xs" disableGutters sx={styles.container}>
        {renderAbaPaywayKhqr()}
        {loadingDiscount || loadingConfigs ? (
          <Grid container justifyContent="center" sx={styles.loading}>
            <CircularProgress size={30} />
          </Grid>
        ) : (
          <>
            <DeliveryDetailSection
              name={name}
              note={note}
              address={address}
              province={province}
              location={location}
              phoneNumber={phoneNumber}
              setNote={setNote}
              setName={setName}
              setState={setState}
              setAddress={setAddress}
              setProvince={setProvince}
              setLocation={setLocation}
              setPhoneNumber={setPhoneNumber}
              setPaymentMethod={setPaymentMethod}
            />

            <PaymentSection
              province={province}
              receiptRef={receiptRef}
              receiptData={receiptData}
              paymentMethod={paymentMethod}
              paymentOption={paymentOption}
              paymentMethods={paymentMethodsConfig}
              discountOnlinePayment={onlinePaymentDiscountConfig}
              setReceiptData={setReceiptData}
              onReceiptChange={onReceiptChange}
              setDeliveryMethod={setDeliveryMethod}
              setPaymentOption={(val) => setPaymentOption(val)}
              setPaymentMethod={(val) => setPaymentMethod(val)}
            />

            <DeliveryMethodSection
              paymentMethod={paymentMethod}
              deliveryMethod={deliveryMethod}
              deliveryConfigs={storeConfig}
              shippingPrice={Number(shippingPrice)}
              setDeliveryMethod={setDeliveryMethod}
            />

            <OrderSummarySection
              type="checkout"
              total={finalTotal}
              subTotal={subTotal}
              discount={finalDiscount}
              deliveryMethod={deliveryMethod}
              shippingPrice={finalShippingPrice}
              handleDiscountInfo={handleDiscountInfo}
              displaySavingInfo={paymentMethod === 'online-payment' && onlinePaymentDiscount > 0}
            />
          </>
        )}
      </Container>

      <Snackbar
        open={snackbar}
        message={snackbarText}
        autoHideDuration={1000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />

      <Footer onClick={onBuyNowClick} />

      {loading && <ModalLoading open={loading} />}

      {openInfo && (
        <ModalSaveInfo
          open={openInfo}
          discount={discount}
          handleClose={handleDiscountInfo}
          onlinePaymentDiscount={onlinePaymentDiscount}
        />
      )}

      {orderSuccess && (
        <ModalOrderSuccess
          name={name}
          address={address}
          total={finalTotal}
          open={orderSuccess}
          subTotal={subTotal}
          discount={finalDiscount}
          phoneNumber={phoneNumber}
          productLength={size(cart)}
          orderDetail={orderDetail}
          paymentMethod={paymentMethod}
          paymentOption={paymentOption}
          deliveryMethod={deliveryMethod}
          shippingPrice={finalShippingPrice}
        />
      )}

      {openPayment && (
        <ModalPayment
          finalTotal={finalTotal}
          openPayment={openPayment}
          onClose={() => setOpenPayment(!openPayment)}
        />
      )}

    </>
  )
}

export default Checkout
