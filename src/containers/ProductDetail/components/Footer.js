import React from "react";
import { Grid, Container, ButtonBase } from "@mui/material";
import { LocalMallOutlined, SendOutlined } from "@mui/icons-material";

const styles = {
  row: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
  },
  button: {
    pr: 2,
    pl: 2,
    m: 1,
    height: 50,
    fontSize: 15,
    width: "100%",
    color: "white",
    borderRadius: 3,
    bgcolor: "#08024A",
    fontWeight: "bold",
  },
  wrapper: {
    bottom: 0, // Change to 60
    height: 80,
    width: "100%",
    display: "flex",
    position: "fixed",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
  },
  icon: {
    mr: 1,
    fontSize: 20,
  },
};

const Footer = (props) => {
  const { onClick } = props;

  return (
    <Grid item sx={styles.wrapper}>
      <Container maxWidth="xs" sx={styles.row}>
        {/* <ButtonBase sx={styles.button} onClick={onClick}>
          <LocalMallOutlined sx={styles.icon} /> Add to Cart
        </ButtonBase> */}
        {/* <ButtonBase
          sx={styles.button}
          href={`https://www.messenger.com/t/880487225330636?ref=${product.sku}`}
        >
          <SendOutlined sx={styles.icon} /> Message Us
        </ButtonBase> */}
      </Container>
    </Grid>
  );
};

export default Footer;
