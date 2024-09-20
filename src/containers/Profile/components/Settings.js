import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { ButtonBase, Grid, Typography } from "@mui/material"
import { Logout, ManageAccounts, KeyboardArrowRight, Language, Map } from "@mui/icons-material"

import Modules from "../../../modules"

import ModalLogout from "../../../components/Modal"
import ModalEditProfile from "./ModalEditProfile"

import { setProfile } from "../../../redux/actions/auth"
import { setActiveTab } from "../../../redux/actions/app"

const styles = {
  button: {
    p: 2,
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: "1px solid black"
  }
}

const Settings = ({ profile }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [language, setLanguage] = useState('en')
  const [modalEdit, setModalEdit] = useState(false)
  const [modalLogout, setModalLogout] = useState(false)

  const handleModalEdit = () => setModalEdit(!modalEdit)

  const handleModalLogout = () => setModalLogout(!modalLogout)

  const handleModalSubmit = async () => {
    try {
      await Modules.authentication.logout()

      setModalLogout(!modalLogout)
      window.recaptchaVerifier = null
      // Reset Recaptcha due to error: reCAPTCHA client element has been removed 

      navigate('/')
      dispatch(setActiveTab(''))
      dispatch(setProfile(null))
    } catch (err) {
      console.log(err)
      alert('Error logout, Please try again')
    }
  }

  return (
    <Grid container flexDirection="column" sx={{ mb: 3 }}>
      <Grid sx={{ mb: 1 }}>
        <Typography fontWeight="bold">
          Settings
        </Typography>
      </Grid>

      <Grid item display="flex" justifyContent="space-between" flexDirection="column">
        {/* <ButtonBase sx={styles.button} disableRipple onClick={() => {
          if (language === 'en') return setLanguage('kh')

          return setLanguage('en')
        }}>
          <Typography sx={{ fontSize: 13 }}>
            <Language fontSize="medium" sx={{ mr: 1 }} />
            Language
          </Typography>

          <Typography sx={{ fontSize: 13 }}>
            {language.toUpperCase()}
          </Typography>
        </ButtonBase> */}

        <ButtonBase sx={styles.button} disableRipple onClick={handleModalEdit}>
          <Typography sx={{ fontSize: 13 }}>
            <ManageAccounts fontSize="medium" sx={{ mr: 1 }} />
            Edit Profile
          </Typography>

          <KeyboardArrowRight />
        </ButtonBase>

        <ButtonBase sx={styles.button} disableRipple onClick={() => navigate('/saved-addresses')}>
          <Typography sx={{ fontSize: 13 }}>
            <Map sx={{ mr: 1, fontSize: 20 }} />
            Manage addresses
          </Typography>

          <KeyboardArrowRight />
        </ButtonBase>

        <ButtonBase
          sx={[
            styles.button,
            { justifyContent: 'center', borderBottom: 0 }
          ]}
          disableRipple
          onClick={handleModalLogout}
        >
          <Typography sx={{ fontSize: 13 }}>
            <Logout fontSize="medium" sx={{ mr: 1, color: 'red' }} />
            Logout
          </Typography>
        </ButtonBase>
      </Grid>

      <ModalLogout
        title="Are you sure to logout?"
        open={modalLogout}
        onClose={handleModalLogout}
        actions={[
          {
            label: 'Cancel',
            style: { bgcolor: '#8c8c8c' },
            onPress: handleModalLogout,
          },
          {
            label: 'Logout',
            onPress: handleModalSubmit,
          }
        ]}
      />

      {modalEdit && (
        <ModalEditProfile
          open={modalEdit}
          onClose={handleModalEdit}
          profile={profile}
        />
      )}
    </Grid>
  )
}

export default Settings
