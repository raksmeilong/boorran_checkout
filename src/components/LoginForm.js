import React, {useState, useEffect} from "react";
import {useDispatch} from "react-redux";
import {getAuth, RecaptchaVerifier, signInWithPhoneNumber} from 'firebase/auth'
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import {IMaskInput} from "react-imask";
import {getCustomerByPhone} from '../redux/actions/customer'
import {TYPES} from '../redux/reducers/customer'

const LoginForm = ({open, handleClose, login}) => {
	const dispatch = useDispatch()
	const auth = getAuth()
	const [phone, setPhone] = useState(null)
	const [otp, setOtp] = useState('')
	const [authData, setAuthData] = useState(null)
	const [otpDisabled, setOtpDisabled] = useState(true)

	useEffect(() => {
		window.recaptchaVerifier = new RecaptchaVerifier(
			'verifierContainer',
			{
				size: 'invisible',
				callback: (response) => {
				},
			},
			auth
		)
	}, [])

	const handleChange = event => {
		const value = event.target.value
		const name = event.target.name
		setPhone(value)
	}

	const resetStates = () => {
		setOtpDisabled(true)
		setPhone(null)
		setAuthData(null)
		setOtp('')
	}

	const handleSubmit = async (event) => {
		event.preventDefault()
		getCustomerByPhone(phone)
			.then(({data}) => {
				if (data) {
					setAuthData(data)
					const appVerifier = window.recaptchaVerifier
					signInWithPhoneNumber(auth, phone, appVerifier)
						.then((confirmationResult) => {
							setOtpDisabled(false)
							window.confirmationResult = confirmationResult
						})
				} else {
					throw new Error('Customer does not exist')
					resetStates()
				}
			})
			.catch((error) => {
				alert(error)
				console.log(error)
			})
	}

	const verifyOTP = (event) => {
		const value = event.target.value
		setOtp(value)
		if (value.length === 6) {
			window.confirmationResult
				.confirm(value)
				.then((result) => {
					dispatch({type: TYPES.GET_CUSTOMER_BY_PHONE, payload: authData})
					login()
				})
				.catch((error) => {
					console.log(error)
				})
		}
	}

	const onClose = () => {
		resetStates()
		handleClose()
	}

	return <>
		<div id="verifierContainer" style={{visibility: 'hidden'}}/>
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Login</DialogTitle>
			<DialogContent>
				<InputField
					id="phone"
					name="phone"
					label="Phone Number"
					type="text"
					onChange={handleChange}
					disabled={!otpDisabled}
					InputProps={{inputComponent: TextMaskCustom}}
				/>
				<InputField
					id="code"
					name="code"
					label="Code"
					type="text"
					onChange={verifyOTP}
					disabled={otpDisabled}
					InputProps={{inputComponent: TextMaskCustom}}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button disabled={!otpDisabled} variant="contained" color="success" onClick={handleSubmit}>
					Get Code
				</Button>
			</DialogActions>
		</Dialog>
	</>
}

export default LoginForm

const InputField = props => {
	return <TextField
		type="text"
		fullWidth
		variant="outlined"
		size="small"
		margin="normal"
		{...props}
	/>
}

const TextMaskCustom = React.forwardRef(function TextMaskCustom(props, ref) {
	const {onChange, name = 'phone', ...other} = props;
	const mask = name === 'phone' ? "+855#00000000" : "000000"
	return <IMaskInput
		{...other}
		mask={mask}
		definitions={{
			'#': /[1-9]/,
		}}
		inputRef={ref}
		onAccept={(value) => onChange({target: {name: props.name, value}})}
		overwrite
	/>
});
