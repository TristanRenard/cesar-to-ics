import puppeteer from "puppeteer"

const login = async () => {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()

  await page.goto('https://cesar.emineo-informatique.fr/login/')
  await page.setViewport({ width: 1080, height: 1024 })


  await page.locator('#username').fill(process.env.CESAR_USERNAME)
  await page.locator('#password').fill(process.env.CESAR_PASSWORD)

  await page.locator('button').click()


  await page.waitForNavigation()


  const ssid = await page.cookies().then(cookies => {
    return cookies.find(cookie => cookie.name === 'PHPSESSID').value
  })

  return { ssid, browser, page }
}

export default login