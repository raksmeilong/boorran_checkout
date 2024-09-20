import React from "react"
import { Grid, Typography } from "@mui/material"

import { faHeart } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const Credit = () => (
  <footer className="my-12 flex flex-col justify-center items-center" style={{ marginBottom: 100 }}>
    <div>
      Make with{" "}
      <FontAwesomeIcon icon={faHeart} className="w-5 text-red-600 mx-1" /> by{" "}
      <a
        href="https://boorran.com"
        target="_blank"
        rel="noreferrer"
        className="text-palette-primary font-bold px-1"
      >
        boorran
      </a>
    </div>

    <Grid container display="flex" alignItems="center" justifyContent="center" flexDirection="row" sx={{ mt: 1 }}>
      <Typography fontWeight="bold" sx={{ fontSize: 20, mr: 1 }}>We accept:</Typography>
      <img
        style={{ width: 50, height: 30, marginTop: 5 }}
        alt="we-accept-khqr"
        src={require('../../assets/landscape-khqr.png')}
      />
    </Grid>
  </footer>
)

export default Credit
