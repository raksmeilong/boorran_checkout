const defaultLocation = { lat: 11.54881915, lng: 104.91484695 }

const queryCollection = '-title:Shipping AND -vendor:Screen AND status:ACTIVE AND tag_not:CCG'

const exports = {
  defaultLocation,
  queryCollection,
  firebaseAuthErrorMessage: {
    'auth/invalid-verification-code': "Invalid verification code",
    'auth/too-many-requests': "Too many request. Please try again on next 4hours"
  }
}

export default exports
