import React from "react"
import { Typography } from "@mui/material"

const styles = {
  horizontalLineWrapper: {
    marginTop: 10,
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row',
  },
  horizontalLine: {
    flex: 1,
    marginTop: 10,
    borderBottom: 'solid 1px'
  }
}

const HorizontalLine = ({ label = '' }) => {
  return (
    <div style={styles.horizontalLineWrapper}>
      <hr style={styles.horizontalLine} />
        <Typography fontSize={14} fontWeight="bold" sx={{ mx: 1 }}>
          {label}
        </Typography>
      <hr style={styles.horizontalLine} />
    </div>
  )
}

export default HorizontalLine
