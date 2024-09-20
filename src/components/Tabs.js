import React from "react"
import { Grid, Typography, ButtonBase } from "@mui/material"

const styles = {
  container: {
    mb: 2,
    border: 1,
    borderRadius: 2,
  },
  tab: {
    py: 1,
    flex: 1,
    display: 'flex',
    alignItems: 'center',
  }
}

const Tabs = ({ activeTab = '', tabs = [] }) => {
  return (
    <Grid container justifyContent="space-between" sx={styles.container}>
      {tabs.map(tab => {
        const isActive = tab.value === activeTab

        return (
          <ButtonBase
            key={tab.value}
            disableRipple
            disableTouchRipple
            onClick={tab.onClick}
            sx={[
              styles.tab,
              isActive && { bgcolor: '#08024a', color: 'white' },
              tab.style && tab.style
            ]}
          >
            <Typography fontWeight="bold" fontSize={14}>
              {tab.label}
            </Typography>
          </ButtonBase>
        )})
      }
    </Grid>
  )
}

export default Tabs
