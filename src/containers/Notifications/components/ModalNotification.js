import React from "react"
import { useNavigate } from "react-router-dom"

import Modal from "../../../components/Modal"

const ModalNotification = ({ open, onClose, notification }) => {
  const navigate = useNavigate()

  const ACTIONS = [
    {
      label: 'Shop now!',
      onPress: () => {
        navigate(`/collections/${notification.metadata.collection}`, { replace: true })
      }
    }
  ]

  return (
    <Modal
      open={Boolean(open)}
      onClose={onClose}
      actions={Boolean(notification.metadata) && ACTIONS}
    >
      <img src={notification.image} />
    </Modal>
  )
}

export default ModalNotification
