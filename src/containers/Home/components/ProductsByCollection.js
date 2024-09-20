import React from "react";
import { ButtonBase } from '@mui/material'
import { useNavigate } from "react-router-dom";

import ProductCard from './ProductCard'
import Loading from "../../../components/Loading";

const ProductByCollection = ({ collection, discounts, loading }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="text-center">
        <Loading />
      </div>
    )
  }

  return (
    <div>
      {collection?.map((collection, index) => {
        return (
          <React.Fragment key={index}>
            <div className="border-4 border-gray-200 rounded-lg pr-3 pl-1 m-1">
              <div className="px-2">
                <div className="mt-5 mb-3 flex justify-between ">
                  <div className="font-primary text-palette-primary   font-semibold ">
                    {collection.node.title}
                  </div>

                  <div className="font-primary text-sm  font-semibold underline ">
                    <ButtonBase
                      onClick={() => {
                        navigate(`/collections/${collection.node.handle}`)
                      }}
                    >
                      See More
                    </ButtonBase>
                  </div>
                </div>
              </div>

              <div className="py-5  grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8">
                {collection.node.products.nodes.map((product) => {
                  const productId = product?.id.split("/")[4];
                  const isVariantsOutOfStock = Boolean((product?.totalInventory || 0) === 0)
                  const hasDiscount =
                    discounts?.boorran_Discounts?.find(
                      (discount) => discount.productId.itemId === productId
                    ) || false;

                  return (
                    <React.Fragment key={productId}>
                      <ProductCard
                        product={product}
                        discount={hasDiscount}
                        isVariantsOutOfStock={isVariantsOutOfStock}
                      />
                    </React.Fragment>
                  )
                })}
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ProductByCollection
