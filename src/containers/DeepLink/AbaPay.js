/* eslint-disable react/display-name */
import React, { useEffect, useState, useRef, forwardRef } from "react"
import { Container, Grid, Typography, ButtonBase } from "@mui/material"
import CryptoJS from "crypto-js"

import Circular from "../../components/Circular"
import { DECRYPTED_SECRET_KEY } from "../../redux/config"

const styles = {
  container: {
    mb: -10,
    display: 'flex',
    minHeight: '85vh',
    alignItems: 'center'
  },
  khqrWrapper: {
    display: 'flex',
    position: 'relative',
    justifyContent: 'center',
  },
  qrCodeWrapper: {
    bottom: 13,
    display: 'flex',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center'
  }
}

const AbaPay = () => {
  const khqrRef = useRef()
  const deepLinkRef = useRef()

  const { search } = window.location
  const hash = search.includes('?id=')
    ? search.split("?id=")[1]
    : null

  const [amount, setAmount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [qrCode, setQrCode] = useState('data:image/png;base64,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')

  useEffect(() => {
    if (hash) {
      const decrypted = CryptoJS.AES.decrypt(hash, DECRYPTED_SECRET_KEY).toString(CryptoJS.enc.Utf8) || null
      const decryptedData = decrypted ? JSON.parse(decrypted) : null
      // TODO: Consider to request server to generate KHQR
      if (decryptedData) {
        setAmount(decryptedData.amount)
        setQrCode(decryptedData.qrImage)

        const doc = document.getElementById('abapay_deep_link')
        doc.setAttribute('href', decryptedData.abapay_deeplink)

        try {
          window.location = decryptedData.abapay_deeplink
        } catch (err) {
          //
        } finally {
          setLoading(false)
        }
      }
    }
  }, [hash])

  return (
    <Container maxWidth="xs" disableGutters sx={styles.container}>
      <a id="abapay_deep_link" ref={deepLinkRef} hidden />

      {loading ? (
        <Circular />
      ) : (
        <Grid container flexDirection="column" alignItems="center">
          <Grid item>
            <ABAKhqr qrCode={qrCode} khqrRef={khqrRef} amount={amount} />
          </Grid>

          <Grid item container justifyContent="center" sx={{ mt: 2 }}>
            <Typography fontWeight="bold" fontSize={14} sx={{ mb: 2 }}>Install ABA Bank to Continue</Typography>

            <Grid container justifyContent="center" gap={1}>
              <Grid item>
                <ButtonBase
                  disableRipple
                  disableTouchRipple
                  onClick={() => {
                    window.open('https://play.google.com/store/apps/details?id=com.paygo24.ibank', '_self', false)
                  }}
                >
                  <img
                    width={90}
                    loading="lazy"
                    alt={`google-play-download`}
                    src={require('../../assets/playstore-download.png')}
                  />
                </ButtonBase>
              </Grid>

              <Grid item>
                <ButtonBase
                  disableRipple
                  disableTouchRipple
                  onClick={() => {
                    window.open('https://itunes.apple.com/al/app/aba-mobile-bank/id968860649?mt=8', '_self', false)
                  }}
                >
                  <img
                    width={75}
                    loading="lazy"
                    alt={`app-store-download`}
                    src={require('../../assets/appstore-download.jpeg')}
                  />
                </ButtonBase>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Container>
  )
}

const ABAKhqr = forwardRef(({ qrCode, khqrRef , amount = 0 }) => (
  <div ref={khqrRef} style={styles.khqrWrapper}>
    <Grid item sx={{ position: 'absolute', top: 50, marginRight: 10 }}>
      <Typography sx={{ fontSize: 11 }}>
        Boorran
      </Typography>

      <Grid item sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <Typography sx={{ fontWeight: 'bold' }}>
          {Number(amount).toFixed(2)}
        </Typography>
        <Typography sx={{ fontSize: 10, ml: 1 }}>
          USD
        </Typography>
      </Grid>
    </Grid>

    <img
      width={200}
      loading="lazy"
      alt={`khqr-frame`}
      style={styles.khqr}
      src={require('../../assets/khqr-frame.png')}
    />

    <Grid item sx={styles.qrCodeWrapper}>
      <img
        width={170}
        src={qrCode}
        loading="lazy"
        alt={`qr-code-sign`}
        style={{ objectFit: 'cover' }}
      />

      <img
        width={35}
        loading="lazy"
        alt={`dollar-sign`}
        src={require('../../assets/aba-dollar.png')}
        style={{ objectFit: 'cover', position: 'absolute', color: 'red' }}
      />
    </Grid>
  </div>
))

export default AbaPay
