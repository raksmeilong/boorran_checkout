import React from "react"
import { Grid, FormControlLabel, Checkbox, Typography } from "@mui/material"

const CheckboxComponent = ({ title = '', checked = false, onClick = () => {} }) => {
  return (
    <Grid container alignItems="center">
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            onChange={({ target: { value } }) => {
              onClick(value === 'on' ? false : true)
            }}
          />
        }
        label={
          <Typography gutterBottom fontWeight="bold" variant="subtitle2" sx={{ mt: 0.7 }}>
            {title}
          </Typography>
        }
      />
    </Grid>
  )
}

export default CheckboxComponent
