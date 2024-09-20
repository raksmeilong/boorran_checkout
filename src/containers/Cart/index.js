import React, { useEffect, useState } from "react"
import { useQuery } from "@apollo/client"
import { useSelector } from "react-redux"
import { Snackbar, Container } from "@mui/material"

import uniq from "lodash/uniq"
import utils from "../../utils"

import Footer from "./components/Footer"
import Circular from "../../components/Circular"
import Navigate from "../../components/Navigate"
import ProductList from "../../components/ProductList"

import { GET_DISCOUNT_BY_PRODUCT_IDS } from '../../config/query'

const styles = {
  container: {
    pl: 2,
    pt: 7,
    pr: 2,
    pb: 15,
  }
}

const Cart = () => {
  const { cart: { cart } } = useSelector((store) => store)

  const [snackbar, setSnackbar] = useState(false)

  const productIds = uniq(Object.values(cart).map(variant => variant.productId))
  const { loading, data: discountDetail } = useQuery(GET_DISCOUNT_BY_PRODUCT_IDS, { variables: { productIds } })

  const { subTotal, discount, total } = utils.helpers.sumCartSubTotal(cart, discountDetail)

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  const handleSnackbarClose = () => setSnackbar(false)

  return (
    <>
      <Container maxWidth="xs" disableGutters sx={styles.container}>
        {loading ? (
          <Circular />
        ) : (
          <>
            <Navigate title="Your Cart" />

            <ProductList
              total={total}
              discount={discount}
              subTotal={subTotal}
              setSnackbar={setSnackbar}
            />
          </>
        )}
      </Container>

      <Snackbar
        open={snackbar}
        autoHideDuration={700}
        message="Product out of stock"
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />

      <Footer />
    </>
  )
}

export default Cart
