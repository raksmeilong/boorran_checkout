import { TELEGRAM_TOKEN } from '../redux/config'

const endpoint = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`

const sendMessage = async (body) => {
  try {
    const req = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      disable_notification: false,
      body: JSON.stringify(body),
    })

    if (req.status !== 200) throw req

    return req
  } catch (err) {
    throw new Error(err)
  }
}

export default { sendMessage }
