import React from 'react'
import { Grid, Typography, InputBase } from '@mui/material'

const Input = ({
    type = 'text',
    title = '',
    value = '',
    lineRows = 3,
    placeholder = '',
    disabled = false,
    multiline = false,
    onChange = () => {},
    endAdornment = null
  }) => (
  <Grid sx={{ mb: 1.5 }}>
    <Typography gutterBottom fontWeight="bold" variant="subtitle2">
      {title}
    </Typography>

    <InputBase
      type={type}
      value={value}
      rows={lineRows}
      disabled={disabled}
      multiline={multiline}
      placeholder={placeholder}
      endAdornment={endAdornment}
      onChange={(e) => onChange(e.target.value)}
      sx={{
        px: 1,
        fontSize: 13,
        width: '100%',
        minHeight: 35,
        borderRadius: 1,
        border: '1px solid lightgray',
      }}
    />
  </Grid>
)

export default Input
