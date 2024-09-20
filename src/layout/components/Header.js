import React, {useState, useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {useLazyQuery, useQuery} from "@apollo/client";
import {useNavigate} from "react-router-dom";
import {getAuth, signOut} from 'firebase/auth'

import {
	Box,
	Grid,
	List,
	Drawer,
	Divider,
	ListItem,
	Snackbar,
	Container,
	InputBase,
	Typography,
	ButtonBase,
	ListItemText,
	ListItemIcon,
	Autocomplete,
	ListItemButton
} from "@mui/material";
import {
	Info,
	Home,
	Close,
	Search,
	QueryStats,
	LocalMallOutlined,
	MenuOutlined,
} from "@mui/icons-material";

import find from "lodash/find"
import size from "lodash/size"
import reduce from "lodash/reduce"
import snakeCase from "lodash/snakeCase"

import utils from "../../utils";
import Logo from "../../assets/Logo192.svg";

import {TYPES} from "../../redux/reducers/cart";
import {TYPES as CUSTOMER_TYPES} from "../../redux/reducers/customer";
import {setQueryCollection} from "../../redux/actions/products";
import {setActiveTab} from "../../redux/actions/app";

import {SEARCH_PRODUCTS, GET_VARIANTS_BY_IDS} from "../../config/query";

import LoginForm from '../../components/LoginForm'

const styles = {
	container: {
		top: 0,
		zIndex: 11,
		height: 60,
		width: "100%",
		display: "flex",
		position: "fixed",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "white",
		boxShadow: "0 1px 5px rgba(0, 0, 0, 0.3)",
		backdropFilter: "blur(9px)",
		bgcolor: "rgba(0,0,30,0.1)",
		color: "text.primary",
	},
	badge: {
		p: 1,
		top: -5,
		width: 2,
		height: 2,
		right: -8,
		fontSize: 10,
		color: "white",
		bgcolor: "black",
		display: "flex",
		borderRadius: 50,
		fontWeight: "bold",
		position: "absolute",
		alignItems: "center",
		justifyContent: "center",
	},
	searchButton: {
		width: "100%",
		display: "flex",
		justifyContent: "center",
	},
	search: {
		my: 1,
		height: 40,
		fontSize: 13,
		boxShadow: 1,
		borderRadius: 2,
		bgcolor: "white",
	},
};

const Header = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const firebaseAuth = getAuth()

	const { cart: {cart} } = useSelector((store) => store);

	const [loginForm, setLoginForm] = useState(false)
	const [search, setSearch] = useState("");
	const [snackbar, setSnackbar] = useState(false);
	const [openDrawer, setOpenDrawer] = useState(false);
	const [searchVisible, setSearchVisible] = useState(false);

	const [getLocations, {loading, data}] = useLazyQuery(SEARCH_PRODUCTS, {
		variables: {
			query: `title:${search}* AND status:ACTIVE AND -title:Shipping AND -vendor:Screen AND tag_not:CCG`,
		},
	});

	const cartStorage = window.localStorage.getItem("cart");
	const cartData = JSON.parse(cartStorage) || {};
	const {data: cartVariants} = useQuery(GET_VARIANTS_BY_IDS, {
		variables: {ids: Object.keys(cartData)},
	});

	const redirectToHomePage = () => {
		navigate('/')
		dispatch(setActiveTab(''))
		dispatch(setQueryCollection({ query: utils.constants.queryCollection, collection: '' }))
	}

	useEffect(() => {
		const payload = reduce(
			JSON.parse(cartStorage),
			(result, datum, key) => {
				const variant = find(cartVariants?.variants, ["id", key]);

				if (variant && variant.quantity > 0) {
					result[key] = datum;
				}

				return result;
			},
			{}
		);

		dispatch({
			type: TYPES.SET_PRODUCT_TO_CART,
			payload,
		});
	}, [cartVariants]);

	const handleSnackbarClose = () => setSnackbar(false);

	const onSearchClick = () => setSearchVisible(!searchVisible);

	const onCartClick = () => {
		if (size(cart) === 0) return setSnackbar(true);

		return navigate("/cart");
	};

	const onOptionClick = (product, primaryVariant) => {
		setSearchVisible(false);

		navigate(`products/${product.sku}`, {state: {product, primaryVariant}});
		window.location.reload();
	};

	const logout = () => {
		signOut(firebaseAuth)
			.then(() => {
				dispatch({type: CUSTOMER_TYPES.GET_CUSTOMER_BY_PHONE, payload: null})
			})
			.catch((error) => {
				console.log(error)
			})
	}

  const LISTS = [
		{
			label: 'Home',
			divider: false,
			Icon: () => <Home sx={{fontSize: 27}} color="primary"/>,
			action: redirectToHomePage,
		},
		{
			label: 'Tracks',
			divider: false,
			Icon: () => <QueryStats sx={{ fontSize: 25 }} color="primary" />,
			action: () => navigate("/"),
		},
		{
			label: 'About Us',
			Icon: () => <Info color="primary"/>,
			action: () => window.open('https://supply.boorran.com', '_self', false),
		}
	]

	const renderOption = (props, option) => (
		<Box
			key={props.id}
			sx={{display: "flex", flexDirection: "row", my: 1, cursor: "pointer"}}
			onClick={() => {
				setSearchVisible(false);

				navigate(`products/${option.handle}`);
				window.location.reload();
			}}
		>
			<img
				loading="lazy"
				alt={props.id}
				src={
					option.featuredImage?.transformedSrc ||
					"https://via.placeholder.com/70x70"
				}
			/>

			<Typography
				noWrap
				sx={{alignSelf: "center", fontWeight: "bold", fontSize: 12, pl: 2}}
			>
				{option.title}
			</Typography>
		</Box>
	);

	const renderSearchBar = (params) => {
		const {InputProps, InputLabelProps, ...rest} = params;

		return (
			<InputBase
				{...rest}
				fullWidth
				id="search"
				sx={styles.search}
				ref={InputProps.ref}
				onKeyUp={(e) => {
					if (e.key === "Enter") {
						getLocations();
						setSearch(e.target.value);
					}
				}}
				inputlabelprops={InputLabelProps}
				placeholder="Search products...."
				endAdornment={renderEndAdornment()}
				startAdornment={<Search fontSize="small" sx={{p: 1.5}}/>}
			/>
		);
	};

	const renderEndAdornment = () => {
		return (
			<ButtonBase sx={{p: 2}} disableRipple onClick={onSearchClick}>
				<Close fontSize="small"/>
			</ButtonBase>
		);
	};

	const renderContent = () => {
		if (searchVisible) {
			const products = data?.products.edges.map((edg) => edg.node);

			return (
				<Autocomplete
					loading={loading}
					options={products || []}
					sx={styles.searchButton}
					noOptionsText="No product found"
					getOptionLabel={(option) => option.title}
					renderInput={(params) => renderSearchBar(params)}
					renderOption={(props, option) => renderOption(props, option)}
				/>
			);
		}

		return (
			<Grid container alignItems="center" justifyContent="space-between">
				<Grid item sx={{ width: 60 }}>
					<ButtonBase onClick={() => setOpenDrawer(true)}>
						<MenuOutlined/>
					</ButtonBase>

					<Drawer
						open={openDrawer}
						anchor={"left"}
						onClose={() => setOpenDrawer(false)}
					>
						<Box
							role="presentation"
							onClick={() => setOpenDrawer(false)}
							onKeyDown={() => setOpenDrawer(false)}
							sx={{width: 250, display: 'flex', flex: 1, flexDirection: 'column', justifyContent: "space-between"}}
						>
							<List sx={{display: 'flex', flexDirection: 'column'}}>
								<ButtonBase disabled>
									<img
										src={Logo}
										width={100}
										height={100}
										style={{marginBottom: 20, marginTop: 20}}
									/>
								</ButtonBase>

								{LISTS.map((list) => (
									<React.Fragment key={snakeCase(list.label)}>
										<ListItem key={snakeCase(list.label)} disablePadding>
											<ListItemButton disabled={!list.action} onClick={list.action}>
												<ListItemIcon>
													{list.Icon()}
												</ListItemIcon>
												<ListItemText primary={list.label}/>
											</ListItemButton>
										</ListItem>
										{list.divider && <Divider/>}
									</React.Fragment>
								))}
							</List>
							<div className="flex flex-col items-center py-6">
								<p className="text-gray-600 mb-2">
									Make with ❤️ by boorran
								</p>
								<div className="w-full gap-3 flex justify-center items-center">
									<button onClick={() => navigate('terms-conditions')}>
										<label className="text-gray-600 text-xs mb-2">Terms & Conditions</label>
									</button>
									<button onClick={() => navigate('privacy-policy')}>
										<label className="text-gray-600 text-xs mb-2">Privacy Policy</label>
									</button>
								</div>
							</div>
						</Box>
					</Drawer>
				</Grid>

				<Grid item>
					<ButtonBase sx={{display: { xs: "flex", md: "flex" }}}>
						<img
							src={Logo}
							width={50}
							height={50}
							style={{ cursor: "pointer" }}
							onClick={redirectToHomePage}
						/>
					</ButtonBase>
				</Grid>

				<Grid item sx={{ width: 60 }}>
					<ButtonBase
						disableRipple
						onClick={onSearchClick}
						sx={[styles.iconButton, { mr: 2 }]}
					>
						<Search sx={{ fontSize: 22 }} color="primary" />
					</ButtonBase>

					{/* <ButtonBase disableRipple onClick={onCartClick}>
						<LocalMallOutlined sx={{ color: "#08024A", fontSize: 22 }}/>

						{size(cart) > 0 ? (
							<Typography sx={styles.badge}>
								{utils.helpers.sumCartQuantity(cart)}
							</Typography>
						) : null}
					</ButtonBase> */}
				</Grid>
			</Grid>
		);
	};

	return (
    <>
      <Grid container sx={styles.container}>
        <Container maxWidth="md">
          <Grid
            container
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            {renderContent()}
          </Grid>
        </Container>

        {loginForm ? (
          <LoginForm
            open={loginForm}
            handleClose={() => setLoginForm(false)}
            login={() => setLoginForm(false)}
          />
        ) : null}
      </Grid>

      <Snackbar
        open={snackbar}
        autoHideDuration={1000}
        message="No product in cart"
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </>
	);
};

export default Header;

