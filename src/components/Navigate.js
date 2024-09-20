import React from "react"
import { useNavigate } from "react-router-dom"
import { Grid, ButtonBase, Typography } from "@mui/material"
import { ArrowBackIosNewOutlined } from "@mui/icons-material"

const styles = {
  wrapper: {
    mt: 3,
    mb: 3,
    display: 'flex',
  },
  iconButton: {
    p: 1,
    mr: 2,
    fontSize: 30,
    boxShadow: 1,
    borderRadius: 50,
    bgcolor: '#f6f7f9d9',
  },
}

const Navigate = ({
  title = "N/A",
  subTitle = null,
  iconStyles = {},
  visibleBackPress = true,
  onBackPress = null
}) => {
  const navigate = useNavigate()

  const onBackClick = () => navigate(-1)

  return (
    <Grid sx={styles.wrapper}>
      {visibleBackPress ? (
        <ButtonBase
          disableRipple
          disableTouchRipple
          onClick={onBackPress ? onBackPress : onBackClick}
          sx={iconStyles}
        >
          <ArrowBackIosNewOutlined sx={styles.iconButton} />
        </ButtonBase>
      ) : null}

      <Grid>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
        {subTitle && (
          <Typography variant="subtitle1" sx={{ fontSize: 12 }}>
            {subTitle}
          </Typography>
        )}
      </Grid>
    </Grid>
  )
}

export default Navigate
