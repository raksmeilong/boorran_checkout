import React, { useState } from "react"
import { useDispatch } from "react-redux"

import Input from "../../../components/Input"
import Modal from "../../../components/Modal"

import { updateProfle } from "../../../redux/actions/auth"

const ModalEditProfile = ({ open, onClose, profile }) => {
  const dispatch = useDispatch()

  const [lastName, setLastName] = useState(profile.lastName || '')
  const [firstName, setFirstname] = useState(profile.firstName || '')
  const [email, setEmail] = useState(profile.email || '')

  const [loading, setLoading] = useState(false)

  const onSubmit = async (firstName, lastName, email) => {
    try {
      setLoading(true)

      await dispatch(updateProfle({
        phoneNumber: profile.phone,
        object: {
          firstName,
          lastName,
          email
        }
      }))

      setLoading(false)
      onClose()
    } catch (err) {
      setLoading(false)
      alert(err.message || 'Something went wrong. Please try again!')
      console.error(err)
    }
  }

  const ACTIONS = [
    {
      label: 'Cancel',
      style: { bgcolor: '#8c8c8c' },
      onPress: onClose,
    },
    {
      label: 'Update',
      loading,
      onPress: () => onSubmit(lastName, firstName, email),
    }
  ]

  return (
    <Modal open={open} title="Edit Profile" actions={ACTIONS}>
      <Input
        title="Last Name"
        value={lastName}
        placeholder="eg.Robin"
        onChange={(val) => setLastName(val)}
      />
      <Input
        title="First Name"
        value={firstName}
        placeholder="eg.Robin"
        onChange={(val) => setFirstname(val)}
      />
      <Input
        title="Email"
        value={email}
        placeholder="eg.example@booran.com"
        onChange={(val) => setEmail(val)}
      />
    </Modal>
  )
}

export default ModalEditProfile
