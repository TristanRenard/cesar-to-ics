import dotenv from 'dotenv'
import generateCalendar from './utils/cesar/generateCalendar.js'
import getCalendar from './utils/cesar/getETD.js'
import login from './utils/cesar/login.js'

dotenv.config()

const getSSID = async () => {
  const { browser, page } = await login()
  const etd = await getCalendar(page)

  generateCalendar(etd)
  await browser.close()
}

getSSID()