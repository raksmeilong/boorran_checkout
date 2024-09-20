import React, { lazy } from "react";
import ReactGA from "react-ga";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Loader from "./Loader";
import Layout from "../layout";

import { GA_TRACKING_CODE } from "../redux/config";

ReactGA.initialize(GA_TRACKING_CODE);

const Home = Loader(lazy(() => import("../containers/Home")));
const Cart = Loader(lazy(() => import("../containers/Cart")));
const Track = Loader(lazy(() => import('../containers/Track')));
const Error = Loader(lazy(() => import("../containers/Error")));
const Orders = Loader(lazy(() => import("../containers/Orders")));
const Profile = Loader(lazy(() => import("../containers/Profile")));
const Checkout = Loader(lazy(() => import("../containers/Checkout")));
const OrderDetails = Loader(lazy(() => import("../containers/OrderDetails")));
const Notifications = Loader(lazy(() => import("../containers/Notifications")));
const ProductDetail = Loader(lazy(() => import("../containers/ProductDetail")));
const PrivacyPolicy = Loader(lazy(() => import("../containers/PrivacyPolicy")));
const SavedAddresses = Loader(lazy(() => import("../containers/SavedAddresses")));
const TermsConditions = Loader(lazy(() => import("../containers/TermsConditions")));
const SavedAddressDetails = Loader(lazy(() => import("../containers/SavedAddressDetails")));

const AbaPayDeepLink = Loader(lazy(() => import("../containers/DeepLink/AbaPay")));

const routes = () => {
	return (
		<BrowserRouter>
			<Layout>
				<Routes>
					<Route path="/" element={<Home/>}/>
					<Route path="*" element={<Error/>}/>
					<Route path="notifications" element={<Notifications/>}/>
					<Route path="profile" element={<Profile/>}/>

					<Route path="orders" element={<Orders/>}/>
					<Route path="orders/:id" element={<OrderDetails/>}/>

					<Route path="collections" element={<Home/>}/>
					<Route path="collections/:sku" element={<Home/>}/>

					<Route path="product/:sku" element={<ProductDetail/>}/>
					<Route path="products/:sku" element={<ProductDetail/>}/>

					<Route path="saved-addresses" element={<SavedAddresses/>}/>
					<Route path="saved-addresses/:id" element={<SavedAddressDetails/>}/>
					<Route path="saved-addresses/:id/order/:orderId" element={<OrderDetails/>}/>

					<Route path="cart" element={<Cart/>}/>
					<Route path="track" element={<Track/>}/>
					<Route path="track" element={<Track/>}/>
					<Route path="checkout" element={<Checkout/>}/>
					<Route path="privacy-policy" element={<PrivacyPolicy/>}/>
					<Route path="terms-conditions" element={<TermsConditions/>}/>

					<Route path="payment/abapay" element={<AbaPayDeepLink/>}/>
				</Routes>
			</Layout>
		</BrowserRouter>
	);
};

export default routes;
