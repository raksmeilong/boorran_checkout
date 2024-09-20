/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect } from "react";
import parseHtml from "html-react-parser";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { useSelector, useDispatch } from "react-redux";
import {
  Grid,
  Chip,
  Snackbar,
  Container,
  IconButton,
  ButtonBase,
  Typography,
} from "@mui/material";
import { Add, Close, Remove } from "@mui/icons-material";
import { get, map, orderBy, isEmpty } from "lodash";

import utils from "../../utils";

import Footer from "./components/Footer";
import ProductPageContent from "../../components/ProductPageContent";
import BackToProductButton from "../../components/BackToProductButton";

import { setProductToCart } from "../../redux/actions/cart";

import {
  GET_STOCK_CONFIGS,
  GET_PRODUCT_DETAILS,
  GET_DISCOUNT_BY_PRODUCT_IDS,
} from "../../config/query";
import Loading from "../../components/Loading";
import Error from "../Error";

const styles = {
  container: {
    pt: 7,
    pb: 12,
  },
  title: {
    pt: 2,
    mb: 2,
    fontSize: 15,
    fontWeight: "bold",
  },
  contentWrapper: {
    p: 3,
    width: "100%",
  },
  row: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
  },
  floatActionButton: {
    right: 20,
    bottom: 100,
    position: "fixed",
  },
  variantButton: {
    mr: 1,
    mb: 1,
    px: 2,
    py: 0.5,
    borderRadius: 1,
    border: "1px solid lightgray",
  },
  imageVariant: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
  },
  discountText: {
    mr: 1,
    color: "gray",
    fontSize: 15,
    textDecoration: "line-through",
  },
  loading: {
    top: 0,
    left: 0,
    flex: 1,
    right: 0,
    bottom: 0,
    zIndex: 1,
    display: "flex",
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    bgcolor: "rgba(0,0,0, 0.2)",
  },
};

const Product = () => {
  const dispatch = useDispatch();
  const urlParams = useParams();

  const {
    cart: { cart },
  } = useSelector((store) => store);

  const [options, setOptions] = useState({});
  const [variant, setVariant] = useState({});

  const [quantity, setQuantity] = useState(1);
  const [snackbar, setSnackbar] = useState(false);
  const [snackBarText, setSnackBarText] = useState("");

  const {
    loading,
    data: productDetail,
    error,
  } = useQuery(GET_PRODUCT_DETAILS, { variables: { sku: urlParams.sku } });

  const productName = productDetail?.productByHandle.title || "N/A";
  const productId = productDetail?.productByHandle.id.split("/")[4] || "";
  const totalVariantsInventory = productDetail?.productByHandle?.totalInventory || 0

  const { loading: discountLoading, data: discountDetail } = useQuery(
    GET_DISCOUNT_BY_PRODUCT_IDS,
    { variables: { productIds: [productId] } }
  );
  const { data: configs } = useQuery(GET_STOCK_CONFIGS, {
    variables: { path: `alert_out_of_stock.products[${productId}]` },
  });

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    if (!isEmpty(productDetail)) {
      const { variants, options: productOptions } =
        productDetail.productByHandle;
      const previewVariant = orderBy(variants.nodes, "position", "asc")[0];

      setOptions(getPrimaryVariantOptions(productOptions, previewVariant));
    }
  }, [productDetail]);

  useEffect(() => {
    if (!isEmpty(options)) {
      const variantObj = productDetail?.productByHandle.variants.nodes.filter(
        (vari) => {
          for (const option in options) {
            const optionPosition = option.split("option")[1] - 1;
            if (vari.selectedOptions[optionPosition].value !== options[option])
              return false;
          }

          return vari;
        }
      )[0];

      setVariant(variantObj);
    }
  }, [options]);

  const getPrimaryVariantOptions = (productOptions, previewVariant) => {
    const options = {};

    for (let i = 0; i < productOptions.length; i += 1) {
      const option = productOptions[i];
      options[`option${option.position}`] =
        previewVariant.selectedOptions[option.position - 1].value;
    }

    return options;
  };

  const handleSnackbarClose = () => setSnackbar(false);

  const imageColorFinder = (images, color) =>
    images.find((img) => img.title.includes(color));

  const handleQuantityChange = (type) => {
    const variantId = variant?.id.split("/")[4] || "";
    const stock = variant.inventoryQuantity;
    const currentQty = !isEmpty(cart)
      ? cart[variantId]?.inventoryQuantity || 0
      : 0;

    const isValidIncrement = currentQty + quantity < stock;
    const isValidDecrement = currentQty + quantity - 1 !== 0;

    if (type === "decrement" && !isValidDecrement) return null;

    if (type === "increment" && !isValidIncrement) {
      setSnackBarText("Out of Stock");
      return setSnackbar(true);
    }

    if (type === "increment" && isValidIncrement) {
      setQuantity(quantity + 1);
    } else if (quantity !== 1) {
      setQuantity(quantity - 1);
    }
  };

  const onVariantSelect = (option, value) => {
    let newOption = options;

    newOption[`option${option.position}`] = value;

    setQuantity(1);
    setOptions({ ...newOption });
  };

  const onAddToCartClick = () => {
    const stock = variant.inventoryQuantity;
    const variantId = variant?.id.split("/")[4] || "";

    const isLimitOutOfStockAvailable = get(
      configs,
      ["stockConfig", [0], "enabled"],
      false
    );
    const currentQty = !isEmpty(cart) ? cart[variantId]?.quantity || 0 : 0;
    const variantLimitStock = get(
      configs,
      ["stockConfig", [0], "variants", variantId],
      0
    );

    const isLimitOutOfStock =
      isLimitOutOfStockAvailable && Number(stock) >= Number(variantLimitStock);

    const isValidIncrement = currentQty + quantity <= stock;

    if (!isValidIncrement || isLimitOutOfStock) {
      setSnackBarText("Out of Stock");
      return setSnackbar(true);
    }

    const productQty =
      cart && cart[variantId] ? cart[variantId].quantity + quantity : quantity;

    const data = {
      [variantId]: {
        stock,
        productId,
        productName,
        quantity: productQty,
        price: variant.price,
        variant: { ...variant },
        productOptions: productDetail.productByHandle.options,
        image: get(variant, ['image', 'thumbnailImg'], productDetail.productByHandle.images.edges[0].node.transformedSrc),
      },
    };

    dispatch(setProductToCart({ ...cart, ...data }));
    setSnackBarText("Added to cart successfully");
    setSnackbar(true);
  };

  const renderVariants = () => {
    const productOptions = orderBy(
      productDetail.productByHandle.options,
      "position",
      "asc"
    );

    return (
      <>
        {productOptions.map((option) => {
          const optionName = option.name;
          const optionPosition = option.position;

          return (
            <Grid key={option.id} item sx={{ mt: 1 }}>
              <Typography
                sx={{ fontSize: 15, fontWeight: "bold", mr: 2, mb: 1 }}
              >
                {optionName}:
              </Typography>

              {map(option.values, (val) => {
                const mainOption = productOptions.find(
                  (opt) => opt.name === "Size"
                ).position;

                const currentOption = options[`option${mainOption}`];
                const isSelected = options[`option${optionPosition}`] === val;

                const image =
                  option.name === "Color" &&
                  imageColorFinder(
                    productDetail?.productByHandle.variants.nodes,
                    val
                  );

                const vari =
                  ["Color", "Screen"].includes(option.name) &&
                  productDetail?.productByHandle.variants.nodes.find(
                    (vari) =>
                      vari.selectedOptions[mainOption - 1].value ===
                        currentOption &&
                      vari.selectedOptions[optionPosition - 1].value === val
                  );

                const disabled = (vari ? vari.inventoryQuantity === 0 : false) || totalVariantsInventory === 0;

                return (
                  <ButtonBase
                    key={val}
                    size="small"
                    disabled={disabled}
                    disableRipple
                    onClick={() => onVariantSelect(option, val)}
                    sx={[
                      styles.variantButton,
                      isSelected && { border: "1px solid #08024A" },
                      disabled && { bgcolor: "lightgray" },
                    ]}
                  >
                    <div style={styles.imageVariant}>
                      {option.name === "Color" ? (
                        <img
                          alt=""
                          width={35}
                          height={40}
                          loading="lazy"
                          src={
                            image?.image?.thumbnailImg ||
                            "https://via.placeholder.com/30x30"
                          }
                        />
                      ) : null}
                      {val}
                    </div>
                  </ButtonBase>
                );
              })}
            </Grid>
          );
        })}
      </>
    );
  };

  const renderPrice = () => {
    const variantId = variant?.id?.split("/")[4] || "";
    const isVariantDiscount = get(
      discountDetail,
      ["boorran_Discounts", [0], "variantIds"],
      []
    ).includes(variantId);
    const discountDatum = get(discountDetail, ["boorran_Discounts", [0]], "");

    const discountPrice = isVariantDiscount
      ? utils.helpers.calculateDiscountPrice(
          discountDatum.type,
          discountDatum.amount,
          Number(variant?.price || 0)
        )
      : 0;

    return (
      <Grid item sx={[styles.row, { mt: 2 }]}>
        <Typography sx={{ fontSize: 15, fontWeight: "bold", mr: 1 }}>
          Price:
        </Typography>

        {isVariantDiscount ? (
          <Grid sx={styles.row}>
            <Typography sx={styles.discountText}>
              ${variant?.price || 0}
            </Typography>
            <Typography
              sx={{ fontSize: 15, color: "red", fontWeight: "bold", mr: 1 }}
            >
              ${discountPrice.toFixed(2)}
            </Typography>
            <Typography
              sx={{
                p: 0.5,
                pl: 1,
                pr: 1,
                fontSize: 12,
                color: "white",
                bgcolor: "red",
                borderRadius: 2,
                fontWeight: "bold",
              }}
            >
              {discountDatum.type === "percentage"
                ? `${discountDatum.amount}% OFF`
                : `Save $${discountDatum.amount}`}
            </Typography>
          </Grid>
        ) : (
          <Typography sx={{ fontSize: 15, mr: 2 }}>
            ${variant?.price || 0}
          </Typography>
        )}
      </Grid>
    );
  };

  const renderQuantity = () => (
    <Grid item sx={[styles.row, { mt: 2 }]}>
      <Typography sx={{ fontSize: 15, fontWeight: "bold", mr: 1 }}>
        Quantity:
      </Typography>

      <Grid
        item
        sx={[styles.row, { width: "18%", justifyContent: "space-between" }]}
      >
        <ButtonBase
          disableRipple
          onClick={() => handleQuantityChange("decrement")}
          sx={{ border: "1px solid #08024A", p: 0.5, borderRadius: 1 }}
        >
          <Remove sx={{ color: "#08024A", fontSize: 13 }} />
        </ButtonBase>

        <Typography sx={{ fontWeight: "bold", fontSize: 13, mx: 1 }}>
          {quantity}
        </Typography>

        <ButtonBase
          disableRipple
          onClick={() => handleQuantityChange("increment")}
          sx={{ border: "1px solid #08024A", p: 0.5, borderRadius: 1 }}
        >
          <Add sx={{ color: "#08024A", fontSize: 13 }} />
        </ButtonBase>
      </Grid>
    </Grid>
  );

  const renderProductQty = () => {
    const variantId = variant?.id?.split("/")[4] || "";
    const productQuantity = variant?.inventoryQuantity || 0;

    const isLimitOutOfStockAvailable = get(
      configs,
      ["stockConfig", [0], "enabled"],
      false
    );
    const variantLimitStock = get(
      configs,
      ["stockConfig", [0], "variants", variantId],
      0
    );

    const isVariantOutOfStock = isLimitOutOfStockAvailable
      ? Number(productQuantity) <= Number(variantLimitStock)
      : Number(productQuantity) <= 0;

    const stockAmount = isVariantOutOfStock ? 0 : productQuantity;
    const quantity = isLimitOutOfStockAvailable ? stockAmount : productQuantity;
    const colorProps = quantity > 0
      ? { bgcolor: '#00b100', color: 'white' }
      : { bgcolor: 'red', color: 'white' }

    return (
      <Grid item sx={[styles.row, { mt: 2 }]}>
        <Typography sx={{ fontSize: 15, fontWeight: "bold", mr: 1 }}>
          Availability:
        </Typography>

        <Typography
          sx={{
            p: 0.5,
            pl: 1,
            pr: 1,
            fontSize: 12,
            color: "white",
            borderRadius: 2,
            fontWeight: "bold",
            ...colorProps
          }}
        >
          {quantity > 0 ? 'In Stock' : 'Out Stock'}
        </Typography>
      </Grid>
    );
  };

  const renderContent = () => {
    if (loading || discountLoading) {
      return <Loading />;
    }

    if (error) return <Error />;

    return (
      <>
        <Grid container>
          <ProductPageContent product={productDetail?.productByHandle || {}} />

          <Grid item sx={styles.contentWrapper} xs={12} sm={6}>
            <BackToProductButton />

            <Typography sx={styles.title}>{productName || ""}</Typography>

            {renderVariants()}
            {renderPrice()}
            {renderProductQty()}
            {renderQuantity()}
            <Grid item sx={[styles.row, { mt: 2 }]}>
              <Typography sx={{ fontSize: 15, fontWeight: "bold", mr: 1 }}>
                Vendor:
              </Typography>
              <Link to={`/collections/${productDetail.productByHandle.vendor}`}>
                <Chip
                  size="small"
                  clickable
                  variant="outlined"
                  label={productDetail.productByHandle.vendor}
                />
              </Link>
            </Grid>

            <Grid item sx={[styles.row, { mt: 2 }]}>
              <Typography sx={{ fontSize: 15, fontWeight: "bold", mr: 1 }}>
                Product Type:
              </Typography>
              <Typography sx={{ fontSize: 15 }}>
                {productDetail.productByHandle.productType}
              </Typography>
            </Grid>

            <Grid sx={{ mt: 2 }}>
              <Typography sx={{ fontSize: 15, fontWeight: "bold", mr: 2 }}>
                Description:
              </Typography>
              <Typography component="span" sx={{ fontSize: 13 }}>
                {parseHtml(productDetail.productByHandle.bodyHtml)}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </>
    );
  };

  return (
    <>
      <Container maxWidth="md" sx={styles.container}>
        {renderContent()}
      </Container>

      <Snackbar
        open={snackbar}
        message={snackBarText}
        autoHideDuration={700}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        action={
          <IconButton
            sx={{ p: 0.5 }}
            color="inherit"
            aria-label="close"
            onClick={handleSnackbarClose}
          >
            <Close />
          </IconButton>
        }
      />

      <Footer onClick={onAddToCartClick} />
    </>
  );
};

export default Product;
