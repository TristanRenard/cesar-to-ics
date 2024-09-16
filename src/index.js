import dotenv from 'dotenv'
import generateCalendar from './utils/cesar/generateCalendar.js'
import getCalendar from './utils/cesar/getETD.js'
import getKeyDates from './utils/cesar/getKeyDates.js'
import login from './utils/cesar/login.js'

dotenv.config()

const getSSID = async () => {
  const { browser, page } = await login()

  const etd = await getCalendar(page)
  await generateCalendar(etd)

  await getKeyDates(page)

  await browser.close()
}

getSSID()