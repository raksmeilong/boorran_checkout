import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Grid, Fab, Tooltip } from "@mui/material"
import { Reviews, PhoneTwoTone, KeyboardArrowUp } from "@mui/icons-material"

import Input from "../../components/Input"
import Modal from "../../components/Modal"

import Telegram from "../../services/Telegram"

const CallNowActionButton = () => {
  return (
    <Tooltip
      title="Call Now"
      href="tel:093564466"
      sx={{
        left: 15,
        bottom: 70, // Change to 30
        zIndex: 11,
        position: 'fixed',
      }}
    >
      <Fab size="medium" color="primary" aria-label="Call Now">
        <PhoneTwoTone />
      </Fab>
    </Tooltip>
  )
}

const MessageUs = () => {
  return (
    <Tooltip
      title="Message Us"
      href="https://www.messenger.com/t/880487225330636"
      sx={{
        right: 15,
        bottom: 70, // Change to 30
        position: 'fixed',
      }}
    >
      <Fab size="medium" color="primary" aria-label="Message Us">

      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"  viewBox="0 0 16 16">
        <path d="M0 7.76C0 3.301 3.493 0 8 0s8 3.301 8 7.76-3.493 7.76-8 7.76c-.81 0-1.586-.107-2.316-.307a.639.639 0 0 0-.427.03l-1.588.702a.64.64 0 0 1-.898-.566l-.044-1.423a.639.639 0 0 0-.215-.456C.956 12.108 0 10.092 0 7.76zm5.546-1.459-2.35 3.728c-.225.358.214.761.551.506l2.525-1.916a.48.48 0 0 1 .578-.002l1.869 1.402a1.2 1.2 0 0 0 1.735-.32l2.35-3.728c.226-.358-.214-.761-.551-.506L9.728 7.381a.48.48 0 0 1-.578.002L7.281 5.98a1.2 1.2 0 0 0-1.735.32z"/>
      </svg>
      </Fab>
    </Tooltip>
  )
}

const Feedback = ({ onClick }) => {
  return (
    <Grid
      sx={{
        right: 15,
        bottom: 140, // Change to 100
        zIndex: 11,
        position: 'fixed',
      }}
    >
      <Fab size="medium" onClick={onClick} color="primary">
        <Reviews sx={{ fontSize: 20 }} />
      </Fab>
    </Grid>
  )
}

const ScrollTopActionButton = ({ onClick }) => {
  return (
    <Grid
      sx={{
        left: 15,
        bottom: 140, // Change to 100
        zIndex: 11,
        position: 'fixed',
      }}
    >
      <Fab size="medium" onClick={onClick} color="primary">
        <KeyboardArrowUp />
      </Fab>
    </Grid>
  )
}

const ModalFeedback = ({ open, onClose }) => {
  const { data } = useSelector(store => store.auth)

  const [loading, setLoading] = useState(false)
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')

  const customerName = `${data?.lastName || ''} ${data?.firstName || ''}`.trim()
  const from = data?.firstName || data?.lastName
    ? `${data?.phone} (${customerName})`
    : data?.phone

  const onSubmit = async () => {
    try {
      setLoading(true)

      await Telegram.sendMessage({
        disable_notification: false,
        parse_mode: 'markdown',
        chat_id: -872973367,
        text: from
          ? `📬 Feedback\n\n*Subject:*${subject}\n*Description:* ${description}\n\nFrom: ${from}`
          : `📬 Feedback\n\n*Subject:*${subject}\n*Description:* ${description}`
      })

      setLoading(false)
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
      onClose()
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      actions={[
        {
          label: 'Submit',
          onPress: onSubmit,
          loading,
        }
      ]}
    >
      <Grid sx={{ mb: 1.5 }}>
        <Input
          value={subject}
          title="Feedback"
          placeholder="Subject"
          onChange={(val) => setSubject(val)}
        />

        <Input
          multiline
          lineRows={5}
          value={description}
          title="Description"
          placeholder="What can we do to improve?"
          onChange={(val) => setDescription(val)}
        />
      </Grid>

    </Modal>
  )
}

const ActionButton = ({ showOnlyScrollTop = false }) => {
  const [modalFeedback, setModalFeedback] = useState(false)
  const [visibleScrollTop, setVisibleScrollTop] = useState(false)

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" })

  useEffect(() => {
    window.addEventListener("scroll", (event) => {
      if (window.scrollY < 350)
        return setVisibleScrollTop(false);

      return setVisibleScrollTop(true);
    })
  });

  if (showOnlyScrollTop && visibleScrollTop) {
    return <ScrollTopActionButton onClick={scrollToTop} />
  } else if (!showOnlyScrollTop) {
    return (
      <div style={{ display: 'flex', backgroundColor: 'red' }}>
        {visibleScrollTop && <ScrollTopActionButton onClick={scrollToTop} />}
        <CallNowActionButton />

        <Feedback onClick={() => setModalFeedback(!modalFeedback)} />
        <MessageUs />

        {modalFeedback ? (
          <ModalFeedback
            open={modalFeedback}
            onClose={() => setModalFeedback(!modalFeedback)}
          />
        ) : null}
      </div>
    );
  }

  return null
};

export default ActionButton;
