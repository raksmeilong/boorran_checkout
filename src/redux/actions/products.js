/* eslint-disable no-useless-catch */
/* eslint-disable no-param-reassign */
import Cookie from "js-cookie";
import moment from "moment";
import map from "lodash/map";
import reduce from "lodash/reduce";
import orderBy from "lodash/orderBy";
import isEmpty from "lodash/isEmpty";
import { NODE_URL } from "../config";

import { TYPES } from "../reducers/products";
import { TYPES as DISCOUNT_TYPES } from "../reducers/discounts";
import { TYPES as CONFIGS_TYPES } from "../reducers/configs";

import utils from "../../utils";

export const setLoading = (bool) => ({
  type: TYPES.SET_LOADING,
  loading: bool,
});

export const setPaginateLoading = (bool) => ({
  type: TYPES.SET_PAGINATE_LOADING,
  loading: bool,
});

const getProductDiscount = (products) => {
  return reduce(
    products,
    (result, product) => {
      if (!isEmpty(product.Discounts)) {
        for (let i = 0; i < product.Discounts.length; i += 1) {
          const discount = product.Discounts[i];
          const { variants } = product;

          const { salesChannels } = discount;
          const discountVariantIds = discount.variantIds;

          const startedAt = Number(moment(discount.startedAt).format("x"));
          const endedAt = Number(moment(discount.endedAt).format("x"));
          const isBetweenDiscountDate = moment().isBetween(startedAt, endedAt);

          if (!salesChannels.includes("storeFront") || !isBetweenDiscountDate)
            break;

          variants.filter((variant) => {
            if (discountVariantIds.includes(variant.itemId)) {
              result[variant.id] = {
                type: discount.type,
                variantId: variant.id,
                productId: product.id,
                itemName: variant.title,
                amount: discount.amount,
                actualPrice: variant.price,
                productName: product.title,
                onlinePaymentDiscountType: discount.onlinePaymentType,
                onlinePaymentDiscountAmount: discount.onlinePaymentAmount,
                savingPrice: utils.helpers.calculateSavingPrice(
                  discount.type,
                  discount.amount,
                  variant.price
                ),
                priceAfterDiscount: utils.helpers.calculateDiscountPrice(
                  discount.type,
                  discount.amount,
                  variant.price
                ),
              };
            }

            return true;
          });
        }
      }

      return result;
    },
    {}
  );
};

// const getCategories = (products) => {
//   const PRODUCT_TYPES = products.map((prd) => prd.productType)
//   const PRODUCT_VENDORS = products.map((prd) => prd.vendor)
//   const DISCOUNTS = some(products, (prd) => prd.Discounts.length >= 1)
//     ? [{ name: 'Discounts', value: 'discounts' }]
//     : []

//   return [
//     { name: 'All', value: 'all' },
//     ...DISCOUNTS,
//     ...uniq(PRODUCT_TYPES).map((val) => ({ name: val, value: kebabCase(val) })),
//     ...uniq(PRODUCT_VENDORS).map((val) => ({
//       name: val,
//       value: kebabCase(val),
//     })),
//   ]
// }

const getConfigs = async () => {
  try {
    const url = `${NODE_URL}/store-front/get-configs`;
    const headers = { "Content-Type": "application/json" };
    const response = await fetch(url, { method: "GET", headers });

    if (!response.ok) throw Error("Fail getting delivery configs");

    const { data } = await response.json();

    return data;
  } catch (err) {
    throw err;
  }
};

const getNextPaginate = (paginateUrl) => {
  const url = paginateUrl.includes(",")
    ? paginateUrl.split(",")[1].split(";")[0]
    : paginateUrl;

  const searchParams = new URLSearchParams(url);
  const pageInfo = searchParams.get("page_info");

  return pageInfo.split(">")[0];
};

export const fetchProducts =
  (payload, callback = null) =>
  async (dispatch, getState) => {
    const { limit = 0 } = payload || {};
    const { nextPagination, productData } = getState().products;

    try {
      const {
        stockConfig,
        deliveryConfig,
        discountOnlinePayment,
        paymentMethods,
      } = await getConfigs();

      const orderURL = `${NODE_URL}/store-front/products?limit=${limit}&offset=${nextPagination}`;
      const headers = { "Content-Type": "application/json" };
      const response = await fetch(orderURL, { method: "GET", headers });

      if (!response.ok) throw Error("Front store fetching data error.");

      const {
        data: { products, paginateUrl, productsAggregate },
      } = await response.json();

      const pagination = (paginateUrl && getNextPaginate(paginateUrl)) || null;

      const SORTED_PRODUCTS = orderBy(
        products,
        (prd) => prd.Discounts.length >= 1,
        "desc"
      );
      const PRODUCTS = map(SORTED_PRODUCTS, (prd) => {
        const alreadyExist = productData.find(
          (prod) => prod.itemId === prd.itemId
        );

        if (alreadyExist) return null;

        const sku = prd.title.includes("/")
          ? prd.title.split(" ").join("-").split("/").join("-").toLowerCase()
          : prd.title.split(" ").join("-").toLowerCase();

        return {
          ...prd,
          sku,
        };
      });

      dispatch({
        type: CONFIGS_TYPES.SET_STOCK_CONFIGS,
        payload: stockConfig.limit_out_of_stock,
      });

      dispatch({
        type: CONFIGS_TYPES.SET_PAYMENT_METHODS,
        payload: paymentMethods,
      });

      dispatch({
        type: CONFIGS_TYPES.SET_DELIVERY_CONFIGS,
        payload: deliveryConfig.storeFront,
      });

      dispatch({
        type: CONFIGS_TYPES.SET_DISCOUNT_ONLINE_PAYMENT,
        payload: discountOnlinePayment.metadata,
      });

      dispatch({
        type: DISCOUNT_TYPES.SET_PRODUCTS_DISCOUNTS,
        payload: getProductDiscount(PRODUCTS),
      });

      // dispatch({
      //   type: CATEGORIES_TYPES.SET_CATEGORIES,
      //   payload: getCategories(PRODUCTS),
      // })

      dispatch({
        type: TYPES.FETCH_PRODUCTS,
        payload: { products: PRODUCTS, pagination, productsAggregate },
      });

      if (callback) callback();

      return true;
    } catch (err) {
      console.log("Error get front store products", err.message);
    }

    return true;
  };

export const fetchCheckoutProducts =
  (productsVariantId, callback) => async (dispatch) => {
    try {
      const sessionToken = Cookie.get("sessionToken");
      const variantIds = productsVariantId.map(
        (variant) => variant.split("-")[0]
      );

      dispatch(setLoading(true));

      const orderURL = `${NODE_URL}/boorran/checkout-products?variantIds=${variantIds.join(
        "="
      )}`;
      const headers = {
        "Content-Type": "application/json",
        Authorization: sessionToken,
      };

      const response = await fetch(orderURL, { method: "GET", headers });

      if (!response.ok)
        throw Error("Something error. Please contact to provider");

      const { data } = await response.json();
      const products = reduce(
        data,
        (result, product) => {
          const id = product.itemId;
          const productQuantity = productsVariantId.find((variant) =>
            variant.match(id)
          );
          const quantity = Number(productQuantity.split("-")[1]);

          result[id] = {
            ...product,
            quantity,
            total: product.price,
          };

          return result;
        },
        {}
      );

      dispatch({
        type: TYPES.FETCHED_CHECKOUT_PRODUCTS,
        payload: { products },
      });
    } catch (err) {
      callback(err);
    }
  };

export const setQueryCollection = (payload) => (dispatch) => {
  dispatch({
    type: TYPES.SET_QUERY_COLLECTION,
    payload,
  })
}
