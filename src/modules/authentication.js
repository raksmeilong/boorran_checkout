import { getAuth } from "firebase/auth"

export default class Authentication {
  static authenticate = () => getAuth()

  static currentUser = () => {
    return this.authenticate().currentUser
  }

  static logout = () => {
    return this.authenticate().signOut()
  }
}