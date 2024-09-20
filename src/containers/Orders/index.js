import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@apollo/client"
import { Container, Grid, Typography } from "@mui/material"
import { get, isEmpty } from "lodash"

import Navigate from "../../components/Navigate"
import Circular from "../../components/Circular"
import OrderListing from "../../components/OrderListing"

import { GET_ORDER_HISTORY } from "../../redux/queries/order"

const styles = {
	container: {
		pl: 2,
		pt: 7,
		pr: 2,
		pb: 15,
	}
}

const Orders = () => {
	const navigate = useNavigate()
	const { data } = useSelector(state => state.auth)

	const {
		loading,
		data: ordersHistoryData,
		fetchMore: fetchMoreOrders,
	} = useQuery(GET_ORDER_HISTORY,
		{
			variables: {
				customerShopifyId: get(data, 'shopifyCustomerId', undefined),
				offset: 0,
				limit: 10,
			}
		}
	)
	const orders = get(ordersHistoryData, 'boorran_Orders', [])
	const totalOrders = get(ordersHistoryData, 'boorran_Orders_aggregate.aggregate.count', 0)

	useEffect(() => {
		window.scrollTo({ top: 0 })
	}, [])

	const onClick = orderId => navigate(orderId)

	const loadmore = () => {
		fetchMoreOrders({
			variables: {
				customerShopifyId: get(data, 'shopifyCustomerId', undefined),
				offset: orders.length + 1,
				limit: 10,
			},
			updateQuery: (prevResult, { fetchMoreResult }) => {
				fetchMoreResult.boorran_Orders = [
					...prevResult.boorran_Orders || [],
					...fetchMoreResult.boorran_Orders,
				];
				return fetchMoreResult;
			},
		});
	};

	return (
		<>
			<Container maxWidth="xs" disableGutters sx={styles.container}>
				{loading ? (
					<Circular />
				) : (
					<>
						<Navigate title="Your Orders" visibleBackPress={false} />

						{!isEmpty(orders) ? (
							<OrderListing
								orders={orders}
								loadmore={loadmore}
								onClick={(orderId) => onClick(orderId)}
								hasMore={orders.length < (totalOrders - 1)}
							/>
						) : (
							<Grid container justifyContent="center" alignItems="center" sx={{ mb: 3, mt: 4 }}>
								<Typography sx={{ mt: 20 }}>
									No Orders
								</Typography>
							</Grid>
						)}
					</>
				)}
			</Container>
		</>
	)
}

export default Orders
