import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { Grid, Typography, ButtonBase, CircularProgress } from "@mui/material"
import libphonenumber from "libphonenumber-js"
import { signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth"

import utils from "../../utils"
import Modules from "../../modules"

import Modal from "../../components/Modal"
import Input from "../../components/Input"

import { getProfile } from "../../redux/actions/auth"

const styles = {
  title: {
    mb: 2,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  logo: {
    width: 110,
    height: 110,
    alignSelf: 'center'
  },
  otpEndAdornment: {
    mr: 0.5,
    position: 'relative'
  },
  otpLoading: {
    top: -6,
    left: -16,
    right: 10,
    bottom: 0,
    position: 'absolute',
  }
}

const Login = ({ open = false, onClose }) => {
  const dispatch = useDispatch()

  const [countdown, setCountdown] = useState(0)
  const [loading, setLoading] = useState(false)

  const [otpCode, setOtpCode] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  const [confirmResult, setConfirmResult] = useState(null)
  const [sendOtpLoading, setSentOtpLoading] = useState(false)

  const auth = Modules.authentication.authenticate()
  const parsedPhoneNumber = libphonenumber(phoneNumber, 'KH')
  const isPhoneNumberValid = Boolean(parsedPhoneNumber && parsedPhoneNumber.isValid())
  const disabledSendOtp = countdown > 0 || !isPhoneNumberValid || sendOtpLoading

  useEffect(() => {
    if (countdown === 0) return null
    setTimeout(() => setCountdown(second => second - 1), 1000)
  }, [countdown])

  useEffect(() => {
    if (otpCode.length === 6) handleLogin()
  }, [otpCode])

  const validation = () => {
    return new Promise(async (resolve, reject) => {
      if (!phoneNumber) {
        reject(new Error('Please Input phone number'))
      }

      if (!isPhoneNumberValid) {
        reject(new Error('Phone number not valid'))
      }

      if (!confirmResult) {
        reject(new Error('Please send request OTP code'))
      }

      if (!otpCode) {
        reject(new Error('Please input OTP code'))
      }

      resolve(true)
    })
  }

  const validateRecaptcha = async () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        'recaptcha-verifier',
        {
          size: 'invisible',
          callback: (response) => {}
        },
        auth
      )
    }
  }

  const handleCountdownClick = async () => {
    try { 
      setSentOtpLoading(true)
      await validateRecaptcha()

      const appVerifier = window.recaptchaVerifier
      const signedIn = await signInWithPhoneNumber(auth, parsedPhoneNumber.number, appVerifier)

      setSentOtpLoading(false)
      setCountdown(60) // 60 minutes for waiting OPT send
      setConfirmResult(signedIn)
    } catch (err) {
      window.recaptchaVerifier = null
      setSentOtpLoading(false)
      alert(utils.constants.firebaseAuthErrorMessage[err.code] || 'Error something, Please try again')
      setCountdown(0)
      console.error(err)
    }
  }

  const handleLogin = async () => {
    try {
      await validation()
      setLoading(true)

      const signedIn = await confirmResult.confirm(otpCode)
      const { user: { phoneNumber } } = signedIn

      await dispatch(getProfile({ phoneNumber }))

      setLoading(false)
      onClose()
    } catch (err) {
      setLoading(false)
      alert(utils.constants.firebaseAuthErrorMessage[err.code] || err.message)
      console.error(err.message)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      actions={[
        { label: "Login", loading, onPress: handleLogin }
      ]}
    >
      <div id="recaptcha-verifier" style={{ visibility: 'hidden' }}></div>
      <Grid container justifyContent="center" direction="column">
          <img
            loading="lazy"
            alt="placeholder"
            style={styles.logo}
            src={require("../../assets/boorran-transparent.png")}
          />
        <Typography variant="h6" sx={styles.title}>Welcome to Boorran</Typography>
        <Input
          type="number"
          value={phoneNumber}
          title="Phone Number"
          placeholder="eg. 0xx xxx xxx"
          onChange={(val) => setPhoneNumber(val)}
        />
        <Input
          type="number"
          value={otpCode}
          title="OTP Code"
          disabled={loading}
          placeholder="Input 6 Digit Code"
          onChange={(val) => setOtpCode(val)}
          endAdornment={
            <ButtonBase
              disableRipple
              disableTouchRipple
              disabled={disabledSendOtp}
              sx={[styles.otpEndAdornment, disabledSendOtp && { color: 'GrayText' }]}
              onClick={handleCountdownClick}
            >
              <Typography sx={{ fontSize: 13, fontWeight: 'bold' }}>
                {sendOtpLoading ? (
                  <CircularProgress size={15} sx={styles.otpLoading} />
                ) :
                  countdown <= 0 ? 'Send' : `${countdown}s`
                }
              </Typography>
            </ButtonBase>
          }
        />
      </Grid>
    </Modal>
  )
}

export default Login
