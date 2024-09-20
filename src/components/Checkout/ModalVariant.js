/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Grid,
  Modal,
  Button,
  Select,
  MenuItem,
  Container,
  Typography,
  CircularProgress,
} from '@mui/material'
import map from 'lodash/map'
import ModalImage from './ModalImage'
import { fetchCheckoutProductVariants } from '../../redux/actions/products'

const style = {
  top: '50%',
  left: '50%',
  bgcolor: 'white',
  borderRadius: 2,
  position: 'absolute',
  transform: 'translate(-50%, -50%)',
}

const imageStyle = {
  width: 120,
  borderRadius: 7,
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
}

const loadingStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const ModalVariant = ({ productId, product, products, open, handleClose }) => {
  const env = process.env.REACT_APP_DEVELOPMENT
  const dispatch = useDispatch()
  const { variants, loadingVariants: loading } = useSelector((store) => store.products)

  const name = product.productName.title
  const title = product.title
  const image = product.image?.source || 'https://react.semantic-ui.com/images/wireframe/image.png'

  const [imageSource, setImageSource] = useState(image)
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)

  const [productType, setProductType] = useState(null)
  const [singleVariant, setSingleVariant] = useState(null)
  const [productVariants, setProductVariants] = useState({})

  const [openImage, setOpenImage] = useState(false)

  useEffect(() => {
    if (!variants[productId]) {
      dispatch(fetchCheckoutProductVariants(productId))
    }
  }, [])

  useEffect(() => {
    if (variants[productId]) {
      const colorIndex = env === 'stg' ? 0 : 1
      const sizeIndex = env === 'stg' ? 1 : 0

      const { isSingleVariant, productType, productVariants } = variants[productId]

      const size = isSingleVariant ? null : title.split('/')[sizeIndex].trim()
      const color = isSingleVariant ? title : title.split('/')[colorIndex].trim()

      setSelectedSize(size)
      setSelectedColor(color)

      setProductType(productType)
      setSingleVariant(isSingleVariant)
      setProductVariants(productVariants)
    }
  }, [variants[productId]])

  const onImageClick = () => setOpenImage(!openImage)

  const onClose = (type) => {
    try {
      const isChange = type === 'change'

      const changeProduct = singleVariant
        ? productVariants[selectedColor]
        : productVariants[selectedColor][selectedSize]

      if (!isChange || product.itemId === changeProduct.itemId) return handleClose()

      const isOutOfStock = product.quantity > changeProduct.stock
      const isProductExist = products[changeProduct.itemId]

      if (isOutOfStock) throw Error('Out of Stock')

      if (isProductExist) {
        const isAgree = window.confirm(
          'You have an existing item in your cart, Do you want to add more quantity to an existing item ?'
        )

        if (!isAgree) return handleClose()
      }

      const title =
        env === 'stg' ? `${selectedColor} / ${selectedSize}` : `${selectedSize} / ${selectedColor}`

      const payload = {
        previousProduct: product,
        nextProduct: {
          ...product,
          productId,
          id: changeProduct.id,
          price: changeProduct.price,
          total: changeProduct.price,
          quantity: product.quantity,
          itemId: changeProduct.itemId,
          imageId: changeProduct.imageId,
          available: changeProduct.stock,
          title: singleVariant ? selectedColor : title,
          image: {
            source: changeProduct.image,
          },
        },
      }

      handleClose(payload)
    } catch (err) {
      alert(err.message)
      handleClose()
    }
  }

  const renderSingleVariant = () => {
    return (
      <Grid item xs={12} sm={7}>
        <Grid item direction="column" sx={{ marginBottom: 1, marginTop: 1 }}>
          <Grid item sx={{ display: 'flex', justifyContent: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {name}
            </Typography>
          </Grid>

          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }} gutterBottom>
            Options
          </Typography>

          <Select
            fullWidth
            size="small"
            value={selectedColor || ''}
            labelId="color-select"
            onChange={(event) => {
              const color = event.target.value
              const item = productVariants[color]
              const image =
                item?.image || 'https://react.semantic-ui.com/images/wireframe/image.png'

              setImageSource(image)
              setSelectedColor(color)
            }}
          >
            {map(productVariants, (color, key) => {
              const isAvailable = color.stock > 0

              return (
                <MenuItem key={key} value={key} disabled={!isAvailable}>
                  {!isAvailable ? `${key} (Out of Stock)` : key}
                </MenuItem>
              )
            })}
          </Select>
        </Grid>
      </Grid>
    )
  }

  const renderMultipleVariant = () => {
    return (
      <Grid item xs={12} sm={7}>
        <Grid item direction="column" sx={{ marginBottom: 1, marginTop: 1 }}>
          <Grid item sx={{ display: 'flex', justifyContent: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {name}
            </Typography>
          </Grid>

          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }} gutterBottom>
            {productType === 'shirt' ? 'Colors' : 'Size'}
          </Typography>

          <Select
            fullWidth
            size="small"
            value={selectedColor || ''}
            labelId="color-select"
            onChange={(event) => {
              const color = event.target.value
              const item = Object.values(productVariants[color])[0]
              const image =
                item?.image || 'https://react.semantic-ui.com/images/wireframe/image.png'

              setImageSource(image)
              setSelectedColor(color)
              setSelectedSize(null)
            }}
          >
            {Object.keys(productVariants).map((color) => (
              <MenuItem key={color} value={color}>
                {color}
              </MenuItem>
            ))}
          </Select>
        </Grid>

        <Grid item direction="column">
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }} gutterBottom>
            {productType !== 'shirt' ? 'Colors' : 'Size'}
          </Typography>

          <Select
            fullWidth
            size="small"
            labelId="size-select"
            value={selectedSize || ''}
            onChange={(event) => {
              const size = event.target.value

              if (productType === 'shoes') {
                const item = productVariants[selectedColor][event.target.value]
                const image =
                  item?.image || 'https://react.semantic-ui.com/images/wireframe/image.png'

                setImageSource(image)
                setSelectedSize(size)
              } else {
                setSelectedSize(event.target.value)
              }
            }}
          >
            {map(productVariants[selectedColor], (size, key) => {
              const isAvailable = size.stock > 0

              return (
                <MenuItem key={key} value={key} disabled={!isAvailable}>
                  {!isAvailable ? `${key} (Out of Stock)` : key}
                </MenuItem>
              )
            })}
          </Select>
        </Grid>
      </Grid>
    )
  }

  return (
    <React.Fragment>
      <Modal open={open} onClose={() => onClose('dismiss')}>
        <Container maxWidth="xs" sx={style}>
          {!loading ? (
            <Box p={2} sx={{ display: 'flex', flexDirection: 'column' }}>
              <Grid container={true} direction="row">
                <Grid
                  item
                  xs={12}
                  sm={5}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={imageSource}
                    alt="modal-img"
                    loading="lazy"
                    style={imageStyle}
                    onClick={onImageClick}
                  />
                </Grid>
                {singleVariant ? renderSingleVariant() : renderMultipleVariant()}
              </Grid>
            </Box>
          ) : (
            <Box p={2} sx={loadingStyle}>
              <CircularProgress />
            </Box>
          )}

          <Box sx={{ m: 2 }}>
            <Button
              fullWidth
              size={'large'}
              variant={'contained'}
              onClick={() => onClose('change')}
              disabled={!singleVariant && selectedColor && !selectedSize}
            >
              Change
            </Button>
          </Box>
        </Container>
      </Modal>

      <ModalImage open={openImage} image={imageSource} handleClose={onImageClick} />
    </React.Fragment>
  )
}

export default ModalVariant
