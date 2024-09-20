import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { Link } from "react-router-dom";
import { Grid, ButtonBase, Typography } from '@mui/material'
import { Equalizer, MoreHoriz, KeyboardReturn } from '@mui/icons-material'

import utils from "../../../utils";

import { TYPES as PRODUCT_TYPES } from '../../../redux/reducers/products'
import ModalEvaluate from './ModalEvaluate'

const ProductCard = ({ product, discount, isVariantsOutOfStock }) => {
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const { showMore } = useSelector(store => store.products)

  const productName = product?.title || "N/A"
  const discountPrice =
    discount &&
    utils.helpers.calculateDiscountPrice(
      discount.type,
      discount.amount,
      Number(product?.priceRangeV2?.minVariantPrice?.amount)
    )

  const image =
    product?.featuredImage?.transformedSrc ||
    "https://react.semantic-ui.com/images/wireframe/image.png";

  const onFeedbackClose = () =>
    dispatch({ type: PRODUCT_TYPES.SET_SHOW_MORE, productName: '' })

  return (
    <div className="relative md:w-full h-120 w-full  shadow-[7px_7px_0px_0px_rgba(0,0,0,0.3)] mx-auto border border-palette-lighter rounded-xl">
      {showMore === productName ? (
        <div
          className="absolute z-10 bg-black/50 inset-0 rounded-xl flex items-center"
          onClick={onFeedbackClose}
        >
          <Grid container flexDirection="column" sx={{ p: 2 }}>
            <Grid item>
              <ButtonBase sx={{ bgcolor: 'white', width: '100%', borderRadius: 2, p: 0.5, mb: 2 }} onClick={() => setOpen(!open)}>
                <Equalizer sx={{ fontSize: 18, mr: 1 }} color="primary" />
                <Typography sx={{ fontWeight: '600' }}>Evaluate</Typography>
              </ButtonBase>
            </Grid>

            <Grid item>
              <ButtonBase
                sx={{ bgcolor: 'white', width: '100%', borderRadius: 2, p: 0.5 }}
                onClick={onFeedbackClose}
              >
                <KeyboardReturn sx={{ fontSize: 18, mr: 1 }} color="error" />
                <Typography sx={{ fontWeight: '600' }}>Return</Typography>
              </ButtonBase>
            </Grid>
          </Grid>
        </div>
      ) : null}

      {open ? (
        <ModalEvaluate
          open={open}
          productName={productName}
          onClose={() => {
            setOpen(!open)
            dispatch({ type: PRODUCT_TYPES.SET_SHOW_MORE, productName: '' })
          }}
        />
      ) : null}

      <Link to={`/products/${product.handle}`}>
        <div className="h-72 w-full border-b-2 border-palette-lighter relative">
          {(discount || isVariantsOutOfStock) && (
            <button className="text-xs font-bold	rounded-full bg-red-600 hover:bg-red-700	p-1 px-2 absolute child z-10 left-2 top-2">
              <p className="text-slate-100	">{isVariantsOutOfStock ? 'Out of Stock ⚠️' : discount.title}</p>
            </button>
          )}

          <img
            className="object-contain h-full w-full pt-0 transform duration-500 ease-in-out hover:scale-110 rounded-xl"
            alt={product.sku}
            src={image}
            loading="lazy"
          />
        </div>
        <div className="h-30 relative">
          <div className=" md:text-base text-sm pt-2 px-4 font-semibold">
            {productName}
          </div>
          <div className="font-primary text-palette-primary text-sm pt-1 px-4 font-medium">
            by {product?.vendor || "N/A"}
          </div>
        </div>
      </Link>

      <div className="font-primary text-palette-primary text-sm pt-2 px-4 font-semibold pb-4 flex flex-row justify-between">
        {discount ? (
          <div className="flex flex-row">
            <div className="line-through pr-2 text-slate-600	">
              {`$${Number(product?.priceRangeV2?.minVariantPrice?.amount).toFixed(2) || "N/A"}`}
            </div>
            <div className="text-red-500	">
              {`$${discountPrice.toFixed(2) || "N/A"}`}
            </div>
          </div>
        ) : (
          <div>
            {`$${Number(product?.priceRangeV2?.minVariantPrice?.amount).toFixed(2) || "N/A"}`}
          </div>
        )}

        <div className="bg-primary">
          <button onClick={() => {
            dispatch({ type: PRODUCT_TYPES.SET_SHOW_MORE, productName });
          }}>
            <MoreHoriz />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard
