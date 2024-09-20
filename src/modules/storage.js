import utils from '../utils'

export default class Storage {
  static uploadImage = async props => {
    try {
      const { image, imageName } = props

      const imgData = {
        file: image,
        name: imageName,
        path: 'erp/payment_request',
      }

      return image ? await utils.helpers.uploadToFirebase(imgData) : null
    } catch (err) {
      throw err
    }
  }
}