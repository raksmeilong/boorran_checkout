import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'

const enviroment = process.env.REACT_APP_DEVELOPMENT
const firebaseConfig = {
  apiKey:
    enviroment === 'default'
      ? 'AIzaSyAhgaDtkWQdPCQKAHEVERNa9fYax2-rREc'
      : 'AIzaSyBaeQRJEBXV4CeQ1r1-nsm1MMABMbvVWIU',
  authDomain:
    enviroment === 'default' ? 'boorran-web-beta.firebaseapp.com' : 'boorran-erp.firebaseapp.com',
  databaseURL:
    enviroment === 'default'
      ? 'https://boorran-web-beta-default-rtdb.asia-southeast1.firebasedatabase.app'
      : 'https://boorran-erp.firebaseio.com',
  projectId: enviroment === 'default' ? 'boorran-web-beta' : 'boorran-erp',
  storageBucket:
    enviroment === 'default' ? 'boorran-web-beta.appspot.com' : 'boorran-erp.appspot.com',
  messagingSenderId: enviroment === 'default' ? '105602029782' : '244165957816',
  appId:
    enviroment === 'default'
      ? '1:105602029782:web:873eb067e1d13ff6c69177'
      : '1:244165957816:web:6c6a6e27a793effa9e3c4d',
  measurementId: enviroment === 'default' ? 'G-FR7GDEHNBW' : 'G-6P3G61PGMT',
}

const app = initializeApp(firebaseConfig)
getAnalytics(app)
