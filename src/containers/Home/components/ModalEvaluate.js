import React, { useState } from 'react'
import { useSelector } from "react-redux"
import { Grid, Typography } from '@mui/material'
import { Star, StarBorder } from '@mui/icons-material'

import Input from '../../../components/Input'
import Modal from '../../../components/Modal'

import Telegram from '../../../services/Telegram'

const ModalEvaluate = ({ open, onClose, productName }) => {
  const { data } = useSelector(store => store.auth)

  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [ratePoints, setRatePoints] = useState(0)

  const onSubmit = async () => {
    const stars = Array.from({ length: ratePoints }, () => "⭐️ ").join('')
    const customerName = `${data?.lastName || ''} ${data?.firstName || ''}`.trim()
    const from = data?.firstName || data?.lastName
      ? `${data?.phone} (${customerName})`
      : data?.phone

    try {
      setLoading(true)
      await Telegram.sendMessage({
        disable_notification: false,
        parse_mode: 'markdown',
        chat_id: -872973367,
        text: from
          ? `📊 Customer Evaluate\n👕*${productName}*\n\nRate: ${stars}\nComment: ${comment}\n\nFrom: ${from}`
          : `📊 Customer Evaluate\n👕*${productName}*\n\nRate: ${stars}\nComment: ${comment}`
      })

      setLoading(false)
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
      onClose()
    }
  }

  const ACTIONS = [
    {
      label: 'Submit',
      onPress: onSubmit,
      loading,
    }
  ]

  return (
    <Modal open={open} onClose={onClose} actions={ACTIONS}>
      <Grid sx={{ mb: 1.5 }}>
        <Typography gutterBottom variant="subtitle2" sx={{ fontWeight: 'bold' }}>
          Evaluate Product
        </Typography>

        <Grid item container flexDirection="row" justifyContent="space-evenly">
          {Array.from({ length: 5 }, (_, idx) => {
            const index = idx + 1
            const StarComp = props => {
              return ratePoints >= index
                ? <Star { ...props } />
                : <StarBorder { ...props } />
            }

            return (
              <StarComp
                key={index}
                color='yellow'
                sx={{ fontSize: 50, cursor: 'pointer' }}
                onClick={() => setRatePoints(ratePoints === index ? index - 1 : index)}
              />
            )
          })}
        </Grid>
      </Grid>

      <Input
        multiline
        lineRows={5}
        value={comment}
        title="Additional Comment"
        placeholder="Let us know about a product quality"
        onChange={(val) => setComment(val)}
      />
    </Modal>
  )
}

export default ModalEvaluate
