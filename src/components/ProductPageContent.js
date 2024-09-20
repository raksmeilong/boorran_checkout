// import RecommendedList from "./RecommendedList";
import ProductImage from "./ProductImage";
// import ProductDetails from "@/components/ProductDetails";
import React from "react";
import { Grid } from "@mui/material";

export default function ProductPageContent({ product }) {
  if (Boolean(product?.image?.edges)) return null;

  return (
    <>
      <Grid item xs={12} sm={6} pt={1}>
        <ProductImage images={product.images.edges} />
        {/* <ProductDetails product={product} /> */}
      </Grid>
    </>
  );
}
