import React from "react"
import {
  Box,
  Grid,
  Modal,
  ButtonBase,
  Typography,
  CircularProgress
} from "@mui/material"

const styles = {
  container: {
    p: 2,
    top: '50%',
    left: '50%',
    width: "85%",
    boxShadow: 24,
    borderRadius: 2,
    position: 'absolute',
    bgcolor: 'background.paper',
    transform: 'translate(-50%, -50%)',
  },
  button: {
    height: 40,
    width: "48%",
    fontSize: 15,
    color: "white",
    borderRadius: 3,
    bgcolor: "#08024A",
    fontWeight: "bold",
  },
  icon: {
    mr: 1,
    fontSize: 20,
  },
}

const ModalComppnent = ({
  open,
  onClose,
  children,
  title = "",
  actions = [],
  buttonVertical = false
}) => (
  <Modal open={open} onClose={onClose}>
    <Box sx={styles.container}>
      {title ? (
        <Typography sx={{ fontWeight: 'bold', mb: 2 }}>
          {title}
        </Typography>
      ) : null}
      {children}
      {actions.length > 0 ? (
        <Grid container flexDirection={buttonVertical ? "column" : "row"} justifyContent="space-between" sx={{ mt: 2 }}>
          {actions.map((action) => (
            <ButtonBase
              disableRipple
              disableTouchRipple
              key={action.label}
              onClick={action.onPress}
              disabled={action.disabled || action.loading || false}
              sx={[
                styles.button,
                action.style || {},
                actions.length === 1 && { width: "100%" },
                (action.disabled || action.loading) && { bgcolor: '#8c8c8c' },
                buttonVertical && { width: '100%' }
              ]}
            >
              {action.loading
                ? <CircularProgress sx={{ width: 20, height: 20 }} size="md" color="inherit" />
                : action.label
              }
            </ButtonBase>
          ))}
        </Grid> 
      ) : null}
    </Box>
  </Modal>
)

export default ModalComppnent
