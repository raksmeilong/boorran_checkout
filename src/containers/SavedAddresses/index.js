import React, { useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useQuery, useMutation } from "@apollo/client"
import { Fab, Grid, Container, ButtonBase, Typography, CircularProgress } from "@mui/material"
import { Add, Delete, FmdGood, KeyboardDoubleArrowRight } from "@mui/icons-material"
import InfiniteScroll from "react-infinite-scroll-component"
import { get, isEmpty } from "lodash"

import Loading from "../../components/Loading"
import Circular from "../../components/Circular"
import Navigate from "../../components/Navigate"

import ModalAddress from "./components/ModalAddress"
import ModalAddNewAddress from "./components/ModalAddAddress"

import { GET_CUSTOMER_ADDRESSES, DELETE_CUSTOMER_ADDRESS } from "../../redux/queries/address"

const styles = {
	container: {
		pl: 2,
		pt: 7,
		pr: 2,
		pb: 15,
	},
  row: {
		py: 1,
		px: 0.5,
		mb: 1.5,
		width: '100%',
    display: 'flex',
    borderRadius: 1.5,
    alignItems: 'flex-start',
		border: "1px solid lightgrey",
  },
	icon: {
		ml: 1,
		mr: 2,
		p: 0.3,
		boxShadow: 1,
		borderRadius: 50,
    alignSelf: 'flex-start',
	},
  breakText: {
    mt: 0.5,
    height: 20,
    overflow: "hidden",
    display: "-webkit-box",
    textOverflow: "ellipsis",
    WebkitLineClamp: "1",
    WebkitBoxOrient: "vertical",
  },
  topRightLabel: {
    px: 1,
		py: 0.5,
    top: -9,
		right: -5,
		width: 90,
		color: 'white',
		bgcolor: '#08024A',
    textAlign: 'center',
		position: 'absolute',
		borderTopRightRadius: 5,
		borderBottomLeftRadius: 5,
	},
  moreLabel: {
		p: 0.4,
    ml: 0.5,
    top: 10,
		width: 85,
		boxShadow: 1,
		borderRadius: 1.5,
    alignSelf: 'center',
		border: "1px solid lightGray"
	},
  defaultPill: {
    px: 1,
    ml: 0.5,
    mt: 0.2,
    color: 'white',
    borderRadius: 50,
    bgcolor: '#08024A'
  }
}

const Addresses = () => {
  const navigate = useNavigate()
  const { data } = useSelector(store => store.auth)

  const [deleting, setDeleting] = useState(false)
  const [modalAddress, setModalAddress] = useState(null)
  const [modalAddNewAddress, setModalAddNewAddress] = useState(null)

  const [deleteCustomerAddress] = useMutation(DELETE_CUSTOMER_ADDRESS)
  const {
		loading,
    refetch,
		data: addressesData,
		fetchMore: fetchMoreOrders,
	} = useQuery(GET_CUSTOMER_ADDRESSES,
		{
			variables: {
				customerShopifyId: get(data, 'shopifyCustomerId', undefined),
				offset: 0,
				limit: 10,
			}
		}
	)

  const addresses = get(addressesData, 'boorran_CustomerAddress', [])
  const totalAddress = get(addressesData, 'boorran_CustomerAddress_aggregate.aggregate.count', 0)

  const loadmore = () =>
		fetchMoreOrders({
			variables: {
				customerShopifyId: get(data, 'shopifyCustomerId', undefined),
				offset: addresses.length + 1,
				limit: 10,
			},
			updateQuery: (prevResult, { fetchMoreResult }) => {
				fetchMoreResult.boorran_CustomerAddress = [
					...prevResult.boorran_CustomerAddress || [],
					...fetchMoreResult.boorran_CustomerAddress,
				];
				return fetchMoreResult;
			},
		});

  const refreshData = () =>
    refetch({
      customerShopifyId: get(data, 'shopifyCustomerId', undefined),
      offset: 0,
      limit: addresses.length,
    })

  const onDelete = async addressId => {
    try {
      const confirm = window.confirm('Are you sure to delete this address?')

      setDeleting(addressId)

      if (confirm) {
        await deleteCustomerAddress({ variables: { id: addressId } })
      }

      setDeleting(false)
    } catch (err) {
      setDeleting(false)
      alert('Error while delete address, Please try agian')
    } finally {
      refreshData()
    }
  }

  const onClick = address => {
    navigate(`/saved-addresses/${address.id}`, {
      state: { address }
    })
  }

  const onAddNewAddress = () => setModalAddNewAddress(true)

  const renderFloatButton = () => {
    return (
      <Grid
        sx={{
          right: 15,
          bottom: 40,
          zIndex: 11,
          position: 'fixed',
        }}
      >
        <Fab size="medium" onClick={onAddNewAddress} color="primary">
          <Add sx={{ fontSize: 20 }} />
        </Fab>
      </Grid>
    )
  }

  return (
    <>
      <Container maxWidth="xs" disableGutters sx={styles.container}>
        {loading ? (
					<Circular />
				) : (
          <>
            <Navigate title="Manage addresses" />
            {!isEmpty(addresses) ? (
              <InfiniteScroll
                next={loadmore}
                dataLength={addresses.length}
                hasMore={addresses.length < totalAddress - 1}
                loader={
                  <div className="text-center">
                    <Loading />
                  </div>
                }
              >
                {addresses.map(addr => {
                  const lastName = get(addr, 'lastName', '')
                  const firstName = get(addr, 'firstName', '')

                  const addressOrderName = `${typeof lastName !== 'object' ? lastName : '' } ${typeof firstName !== 'object' ? firstName : null}`.trim()
                  const addressOrdersCount = get(addr, 'countOrders.aggregate.count', 0)
                  const hasOrders = addressOrdersCount > 0

                  return (
                    <Grid key={addr.id} sx={styles.row}>
                      <Grid container>
                        <Grid item container position="relative">
                          <Grid item alignSelf="center" sx={styles.icon}>
                            <FmdGood sx={{ color: '#08024A' }} />
                          </Grid>

                          <ButtonBase
                            disableRipple
                            disableTouchRipple
                            onClick={() => setModalAddress(addr)}
                            sx={{ flex: 1, justifyContent: "space-between" }}
                          >
                            <Grid item container flexDirection="column" alignItems="flex-start">
                              <Grid item container alignItems="center">
                                <Typography fontSize={14} fontWeight="bold">{addressOrderName}</Typography>
                                {addr.isDefault && (
                                  <Typography fontWeight="bold" fontSize={10} fontStyle="italic" sx={styles.defaultPill}>
                                    Default
                                  </Typography>
                                )}
                              </Grid>
                              <Typography fontSize={11} color="gray">{addr.phone}</Typography>
                              <Typography fontSize={11} color="gray">{addr.city}</Typography>

                              <Typography fontSize={11} align="left" sx={styles.breakText}>
                                {addr.address}
                              </Typography>
                            </Grid>
                          </ButtonBase>

                          {!hasOrders ? (
                            <Grid item alignSelf="center" sx={{ alignSelf: 'center', mx: 1 }}>
                              {deleting === addr.id ? (
                                <CircularProgress sx={{ width: 15, height: 15, mt: 1 }} size="md" color="inherit" />
                                ) : (
                                <ButtonBase
                                  disableRipple
                                  disableTouchRipple
                                  onClick={() => onDelete(addr.id)}
                                >
                                  <Delete sx={{ color: 'red', fontSize: 23 }} />
                                </ButtonBase>
                              )}
                            </Grid>
                          ) : (
                            <>
                              <Grid item sx={styles.topRightLabel}>
                                <Typography fontSize={11} fontWeight="bold">
                                  {hasOrders === 1
                                    ? `${addressOrdersCount} Order`
                                    : `${addressOrdersCount} Orders`
                                  }
                                </Typography>
                              </Grid>

                              <ButtonBase disableRipple disableTouchRipple onClick={() => onClick(addr)} sx={styles.moreLabel}>
                                <Typography fontWeight="bold" fontSize={11} sx={{ color: 'black' }}>
                                  More
                                </Typography>
                                <KeyboardDoubleArrowRight sx={{ fontSize: 15, ml: 1 }} />
                              </ButtonBase>
                            </>
                          )}

                        </Grid>
                      </Grid>
                    </Grid>
                  )
                })}
              </InfiniteScroll>
            ) : (
              <Grid container justifyContent="center" alignItems="center" sx={{ mb: 3, mt: 4 }}>
								<Typography sx={{ mt: 20 }}>
									No Saved Addresses
								</Typography>
							</Grid>
            )}
          </>
        )}

        {renderFloatButton()}

        {modalAddNewAddress && (
          <ModalAddNewAddress
            open={modalAddNewAddress}
            onClose={({ refresh = false }) => {
              setModalAddNewAddress(null)

              if (refresh) refreshData()
            }}
          />
        )}

        {modalAddress && (
          <ModalAddress
            open={modalAddress}
            modalAddress={modalAddress}
            onClose={({ refresh = false }) => {
              setModalAddress(null)

              if (refresh) refreshData()
            }}
          />
        )}
      </Container>
    </>
  )
}

export default Addresses
