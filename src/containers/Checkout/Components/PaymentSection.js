import React, { useState } from 'react'
import { Box, Button, ButtonBase, Grid, Paper, Typography } from '@mui/material'
import { ChevronRight, UploadFile, CheckCircleOutline } from '@mui/icons-material'
import isEmpty from 'lodash/isEmpty'

import ModalImage from '../../../components/Checkout/ModalImage'

const styles = {
  headline: {
    pl: 4,
    pr: 4,
    pt: 1,
    pb: 1,
  },
  information: {
    p: 3,
    display: 'flex',
    borderRadius: 2,
    flexDirection: 'column',
  },
  button: {
    mr: 1,
    px: 2,
    py: 1.5,
    borderRadius: 1,
    position: 'relative',
    border: '1px solid lightgray',
  },
  paymentOption: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  bankInfo: {
    height: 80,
    width: '100%',
    display: 'flex',
    marginBottom: 2,
    borderRadius: 1,
    alignItems: 'center',
    flexDirection: 'row',
    border: '1px solid #08024A',
    justifyContent: 'space-evenly',
  },
  receiptUpload: {
    width: '100%',
    minHeight: 80,
    borderRadius: 1,
    fontSize: 13,
    bgcolor: '#f5f5f5d9',
    flexDirection: 'column',
    boxShadow: '0 1px 1px rgba(0, 0, 0, 0.3)',
  },
  viewReceipt: {
    mt: 2,
    width: '100%',
    fontSize: 13,
    color: 'white',
    fontWeight: 'bold',
    bgcolor: '#08024A',
  },
  discountOnlinePaymentBadge: {
    top: 0,
    right: 0,
    fontSize: 11,
    color: 'white',
    padding: '0px 8px',
    fontWeight: 'bold',
    position: 'absolute',
    backgroundColor: 'red',
    borderTopRightRadius: 3,
    borderBottomLeftRadius: 3,
  },
}

const PAYMENT_METHODS = [
  { text: 'Cash on Delivery', value: 'cash-on-delivery' },
  { text: 'Online Payment', value: 'online-payment' },
]

const PaymentSection = (props) => {
  const {
    province,
    receiptRef,
    receiptData,
    paymentMethod,
    paymentOption,
    paymentMethods,
    discountOnlinePayment,

    setReceiptData,
    onReceiptChange,
    setPaymentMethod,
    setPaymentOption,
    setDeliveryMethod,
  } = props
  const [openModal, setOpenModal] = useState(false)

  const onMethodClick = (option) => {
    if (option.value === 'cash-on-delivery') {
      setReceiptData(null)
      setPaymentOption(null)
      setDeliveryMethod('2-hour')
      setPaymentMethod(option.value)
    } else {
      setPaymentMethod(option.value)
    }
  }

  const onOptionClick = (option) => setPaymentOption(option)

  const renderHeadline = () => {
    return (
      <Grid item sx={styles.headline}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Payment Details
        </Typography>

        <Typography variant="subtitle1" sx={{ fontSize: 12 }}>
          Please select one of the payment methods
        </Typography>
      </Grid>
    )
  }

  const renderPaymentMethods = () => {
    return (
      <Grid sx={{ mb: 1.5 }}>
        <Typography gutterBottom variant="subtitle2" sx={{ fontWeight: 'bold' }}>
          Methods
        </Typography>

        <Grid sx={{ display: 'flex', flexDirection: 'column' }}>
          {PAYMENT_METHODS.map((method) => {
            const isSelected = method.value === paymentMethod
            const isOnlinePayment = method.value === 'online-payment'
            const isDiscountOnlinePaymentAvailable = Number(discountOnlinePayment.amount) > 0

            const disabledCODForProvinceOrder =
              method.value === 'cash-on-delivery' && province === 'province'

            return (
              <Button
                fullWidth
                disableRipple
                variant="text"
                key={method.value}
                disabled={disabledCODForProvinceOrder}
                onClick={() => onMethodClick(method)}
                sx={[
                  styles.button,
                  { marginBottom: 1, height: 50, textTransform: 'none' },
                  isSelected && { border: '1px solid #08024A' },
                  disabledCODForProvinceOrder && {
                    bgcolor: 'rgba(185, 185, 185, 1)',
                  },
                ]}
              >
                {isOnlinePayment && isDiscountOnlinePaymentAvailable && (
                  <div style={styles.discountOnlinePaymentBadge}>
                    {discountOnlinePayment.type === '%'
                      ? `${discountOnlinePayment.amount}${discountOnlinePayment.type} OFF`
                      : `Save ${discountOnlinePayment.amount}${discountOnlinePayment.type}`}
                  </div>
                )}
                {method.text}
              </Button>
            )
          })}
        </Grid>
      </Grid>
    )
  }

  const renderPaymentOptions = () => {
    const paymentOptions = paymentMethods.filter(meth => meth.value !== 'ABA')

    let ONLINE_PAYMENT_OPTIONS = paymentOptions.map((method) => {
      return {
        text: method.text,
        value: method.value,
        src: method.metadata.logo,
        accountName: method.metadata.name,
        accountNumber: method.metadata.accountNumber,
      }
    })

    ONLINE_PAYMENT_OPTIONS  = [{
      text: 'ABA KHQR',
      subText: 'Scan to pay with any banking app',
      value: 'aba_khqr',
      src: require('../../../assets/khqr.png'),
    }, ...ONLINE_PAYMENT_OPTIONS]

    return (
      <Grid sx={{ mb: 1.5 }}>
        <Typography gutterBottom variant="subtitle2" sx={{ fontWeight: 'bold' }}>
          Options
        </Typography>

        <Grid sx={{ display: 'flex', flexDirection: 'column' }}>
          {ONLINE_PAYMENT_OPTIONS.map((option) => {
            const logo = option.src || 'https://via.placeholder.com/30x30'
            const isSelected = !isEmpty(paymentOption) && option.value === paymentOption.value

            return (
              <Button
                fullWidth
                variant="text"
                disableRipple
                key={option.value}
                onClick={() => onOptionClick(option)}
                sx={[
                  styles.button,
                  { marginBottom: 1, textTransform: 'none', height: 50 },
                  isSelected && { border: '1px solid #08024A' },
                ]}
              >
                <div style={{ ...styles.paymentOption, flex: 1 }}>
                  <img
                    src={logo}
                    width={30}
                    height={30}
                    loading="lazy"
                    style={{ marginRight: 10, borderRadius: 5 }}
                    alt={`option-${option.value}`}
                  />
                  <div style={{ display: 'flex', flex: 1, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: 13 }}>
                          {option.text}
                        </Typography>
                        {/* {option.value === 'aba_khqr' && (
                          <Typography fontWeight="bold" fontSize={10} fontStyle="italic" sx={{ ml: 0.5 }}>
                            (Beta)
                          </Typography>
                        )} */}
                      </div>
                      <Typography sx={{ fontSize: 10 }}>
                        {option.subText || ''}
                      </Typography>
                    </div>
                    <ChevronRight sx={{ color: '#08024A', alignSelf: 'center' }} />
                  </div>
                </div>
              </Button>
            )
          })}
        </Grid>
      </Grid>
    )
  }

  const renderOptionDetail = () => {
    if (!paymentOption.accountName || !paymentOption.accountNumber) return null

    return (
      <Grid sx={{ mb: 1.5 }}>
        <Typography gutterBottom variant="subtitle2" sx={{ fontWeight: 'bold' }}>
          Please send your payment to our account below:
        </Typography>

        <Box sx={styles.bankInfo}>
          <Grid>
            <Typography variant="subtitle2" align="center" sx={{ fontWeight: 'bold' }}>
              Account Name:
            </Typography>
            <Typography variant="subtitle2" align="center" sx={{ maxWidth: 140 }}>
              {paymentOption.accountName}
            </Typography>
          </Grid>

          <Grid sx={{ bgcolor: '#08024A', border: '1px solid #08024A', height: 50 }} />

          <Grid>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
              Account Number:
            </Typography>
            <Typography variant="subtitle2" align="center">
              {paymentOption.accountNumber}
            </Typography>
          </Grid>
        </Box>

        {renderReceiptSubmit()}
      </Grid>
    )
  }

  const renderReceiptSubmit = () => (
    <>
      <input hidden type="file" accept="image/*" ref={receiptRef} onChange={onReceiptChange} />

      <ButtonBase
        variant="text"
        disableRipple
        sx={styles.receiptUpload}
        onClick={() => receiptRef.current.click()}
      >
        {receiptData ? (
          <>
            <Typography gutterBottom variant="subtitle2" align="center">
              Receipt uploaded
            </Typography>
            <CheckCircleOutline fontSize="medium" sx={{ color: '#67ac5bd9' }} />
          </>
        ) : (
          <>
            <Typography gutterBottom variant="subtitle2" align="center">
              Submit your receipt here
            </Typography>
            <UploadFile fontSize="medium" sx={{ color: 'primary' }} />
          </>
        )}
      </ButtonBase>

      {receiptData && (
        <ButtonBase
          onClick={() => setOpenModal(!openModal)}
          sx={[styles.button, styles.viewReceipt]}
        >
          View Receipt
        </ButtonBase>
      )}
    </>
  )

  return (
    <>
      {renderHeadline()}

      <Paper sx={styles.information}>
        {renderPaymentMethods()}
        {paymentMethod === 'online-payment' && renderPaymentOptions()}
        {paymentOption && renderOptionDetail()}
      </Paper>

      <ModalImage
        open={openModal}
        handleClose={() => setOpenModal(!openModal)}
        image={receiptData && URL.createObjectURL(receiptData)}
      />
    </>
  )
}

export default PaymentSection
