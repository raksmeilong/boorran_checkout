import {GET, POST} from 'fetchier'
import {NODE_URL} from '../config'

export const setCustomer = (data) => {
	return POST({
		url: `${NODE_URL}/boorran/create-customer`,
		body: data,
		headers: {'Content-Type': 'application/json'},
	})
}

export const getCustomer = (customerId) => {
	return GET({
		url: `${NODE_URL}/store-front/customer?id=${customerId}`,
		headers: {'Content-Type': 'application/json'},
	})
}

export const getCustomerByPhone = (phone) => {
	return POST({
		url: `${NODE_URL}/boorran/customer/verify`,
		body: {phone},
		headers: {'Content-Type': 'application/json'},
	})
}

