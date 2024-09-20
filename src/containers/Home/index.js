import React, { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import ReactGA from "react-ga"
import { useQuery } from "@apollo/client"
import { Grid, Container, Typography } from "@mui/material"
import { BrokenImage } from "@mui/icons-material"
import InfiniteScroll from "react-infinite-scroll-component"
import Marquee from "react-fast-marquee"
import moment from "moment"
import { isEmpty, get } from "lodash"

import utils from '../../utils'
import { pixelTracking } from "../../services/MetaPixel"

import Loading from "../../components/Loading"
import ProductCard from "./components/ProductCard"
import Collections from "./components/Collections"
import ProductsByCollection from "./components/ProductsByCollection"

import { GA_TRACKING_CODE } from "../../redux/config"
import { setQueryCollection } from '../../redux/actions/products'

import { GET_ANNOUNCEMENT } from "../../redux/queries/notification"
import { GET_PRODUCTS, GET_DISCOUNTS, GET_COLLS_RETURN_PRODUCTS } from "../../config/query"

ReactGA.initialize(GA_TRACKING_CODE);

const withRouter = (Component) => {
  const ComponentWithRouterProp = (props) => {
    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    return <Component {...props} router={{ location, navigate, params }} />;
  };

  return ComponentWithRouterProp;
};

const first = 12;

const Home = () => {
  const dispatch = useDispatch();
  const { query , activeCollection } = useSelector(store => store.products)

  const { data: announcement } = useQuery(GET_ANNOUNCEMENT);
  const { data: discounts } = useQuery(GET_DISCOUNTS);
  const { data: collections, loading: loadCollections } = useQuery(GET_COLLS_RETURN_PRODUCTS);
  const {
    refetch,
    data: products,
    loading: loadProducts,
    fetchMore: fetchMoreProducts,
  } = useQuery(GET_PRODUCTS, { variables: { first, query } });

  useEffect(() => {
    window.scrollTo({ top: 0 });

    // Analytics
    pixelTracking("Lead-Landing Page");
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  useEffect(() => {
    const sku = location.pathname.split('/')[2]
    refetchProducts(sku)
  }, [location.pathname])

  const refetchProducts = (sku) => {
    const query = isEmpty(sku)
      ? utils.constants.queryCollection
      : `tag:${sku} OR vendor:${sku} AND status:ACTIVE AND tag_not:CCG`;

    dispatch(setQueryCollection({ query, collection: sku }))
    refetch({ first, query });
  }

  const renderCollections = () => {
    if (loadCollections) return <Loading />

    return (
      <Collections
        activeCollection={activeCollection}
        data={collections?.channel?.collections?.edges.map((edg) => edg.node)}
      />
    );
  };

  const renderProducts = () => {
    if (loadProducts) return <Loading />;

    const PRODUCTS = products?.products?.edges?.map((edg) => edg.node);

    if (!PRODUCTS || PRODUCTS.length === 0) {
      return (
        <div className="mx-auto text-center">
          <BrokenImage sx={{ fontSize: 50, color: "rgba(0, 0, 0, 0.25)" }} />
          <p>No Product Found</p>
        </div>
      );
    }

    const loadmore = () => {
      const { endCursor } = products?.products?.pageInfo;

      fetchMoreProducts({
        variables: {
          after: endCursor,
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          fetchMoreResult.products.edges = [
            ...prevResult.products.edges,
            ...fetchMoreResult.products.edges,
          ];
          return fetchMoreResult;
        },
      });
    };

    if (!activeCollection) {
      return (
        <ProductsByCollection
          discounts={discounts}
          loading={loadCollections}
          collection={collections?.channel.collections.edges}
        />
      )
      
    }

    return (
      <div className="mx-auto">
        <InfiniteScroll
          next={loadmore}
          dataLength={PRODUCTS.length}
          hasMore={products?.products?.pageInfo?.hasNextPage || false}
          loader={
            <div className="text-center">
              <Loading />
            </div>
          }
        >
          <div className="py-5 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8">
            {PRODUCTS.map((product, index) => {
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
              );
            })}
          </div>
        </InfiniteScroll>
      </div>
    );
  };

  const renderAnnouncement = () => {
    const announcementData = get(announcement, 'boorran_Notifications[0]', null)

    if (!announcementData || !moment().isBetween(announcementData.start, announcementData.end))
      return null

    return (
      <Grid container sx={{ mt: 1.3, bgcolor: 'red', color: 'white', boxShadow: 1, height: 35 }}>
        <Marquee pauseOnClick gradient gradientWidth={5}>
          <Typography fontWeight="bold" fontSize={14}>{announcementData.title}</Typography>
        </Marquee>
      </Grid>
    )
  }

  return (
    <>
      <Container
        maxWidth="md"
        disableGutters
        sx={{
          pl: 2,
          pt: 7,
          pr: 2,
          pb: 15,
        }}
      >
        <Grid sx={{ textAlign: 'center', mb: 2, mt: 4 }}>
          <Typography fontWeight="bold" fontSize={30}>
            Boorran Store
          </Typography>
          <Typography fontSize={15}>
            Make with ❤️ by boorran
          </Typography>

          {renderAnnouncement()}
        </Grid>

        {renderCollections()}
        {renderProducts()}
      </Container>
    </>
  );
};

export default withRouter(Home)
