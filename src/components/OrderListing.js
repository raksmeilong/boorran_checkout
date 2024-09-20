import React from "react"
import { ButtonBase, Grid, Typography } from "@mui/material"
import { KeyboardDoubleArrowRight } from "@mui/icons-material"
import InfiniteScroll from "react-infinite-scroll-component"
import { get } from "lodash"
import moment from "moment"

import utils from "../utils"

import Loading from "./Loading"

const styles = {
  row: {
		py: 1,
		px: 1.5,
		mb: 1.5,
		width: '100%',
    display: 'flex',
    borderRadius: 1.5,
		border: "1px solid lightgrey"
  },
	icon: {
		ml: 1,
		mr: 2,
		p: 0.3,
		boxShadow: 1,
		borderRadius: 50,
	},
	topRightLabel: {
		px: 1,
		py: 0.5,
		bottom: 2,
		right: -12,
		width: 90,
		color: 'white',
		bgcolor: '#08024A',
		position: 'absolute',
		borderTopRightRadius: 5,
		borderBottomLeftRadius: 5,
	},
	moreLabel: {
		p: 0.4,
		width: 100,
		boxShadow: 1,
		borderRadius: 1.5,
		border: "1px solid lightGray"
	}
}

const OrderListing = ({
  orders = [],
  loadmore = () => {},
  hasMore = false,
  onClick = () => {}
}) => {
  return (
    <InfiniteScroll
      next={loadmore}
      dataLength={orders.length}
      hasMore={hasMore}
      loader={
        <div className="text-center">
          <Loading />
        </div>
      }
    >
      {orders.map((order, key) => {
        const total = `$${order.boorranGrandTotal}`
        const orderNumber = order.orderNumber
        const createAt = moment(order.createdAt).format('DD MMM, YYYY')
        const createAtWithClock = moment(order.createdAt).format('DD MMM, YYYY [at] hh:mm A')

        const { color, status, icon } =
          utils.helpers.getOrderLabelAndStatus({
            packStatus: order.packStatus,
            driverId: order.driverId,
            paymentStatus: order.paymentStatus,
            isCollectedByAdmin: order.isCollectedByAdmin
          })

        const itemsCount = get(order, 'orderItemsCount.aggregate.count', 0)
        const itemCountDisplay = itemsCount > 1
          ? `${itemsCount} items`
          : `${itemsCount} item`

        return (
          <ButtonBase
            key={key}
            disableRipple
            disableTouchRipple
            sx={styles.row}
            onClick={() => onClick(order.id)}
          >
            <Grid container>
              <Grid item container justifyContent="space-between" sx={{ position: 'relative' }}>
                <Grid>
                  <Typography fontSize={12}>{createAt}</Typography>
                </Grid>

                <Grid sx={{ ...styles.topRightLabel, bgcolor: color }}>
                  <Typography fontSize={11} fontWeight="bold" sx={{ color: 'white' }}>{status}</Typography>
                </Grid>
              </Grid>
              
              <Grid item container>
                <Grid item alignSelf="center" sx={styles.icon}>
                  {icon}
                </Grid>

                <Grid display="flex" flex={1} justifyContent="space-between">
                  <Grid item container flexDirection="column" alignItems="flex-start">
                    <Typography fontSize={14} fontWeight="bold">#{orderNumber}</Typography>
                    <Typography fontSize={12} color="gray">{itemCountDisplay} ~ {total}</Typography>
                    <Typography fontSize={12} color="gray">{createAtWithClock}</Typography>
                  </Grid>
                  <Grid item container justifyContent="center" alignItems="center" alignSelf="center" sx={styles.moreLabel}>
                    <Typography fontWeight="bold" fontSize={11} sx={{ color: 'black' }}>
                      More
                    </Typography>
                    <KeyboardDoubleArrowRight sx={{ fontSize: 15, ml: 1 }} />
                  </Grid>
                </Grid>
              </Grid>

            </Grid>
          </ButtonBase>
        )
      })}
    </InfiniteScroll>
  )
}

export default OrderListing
