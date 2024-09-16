import puppeteer from "puppeteer"

const login = async () => {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()

  // Navigate the page to a URL.
  await page.goto('https://cesar.emineo-informatique.fr/login/')

  // Set screen size.
  await page.setViewport({ width: 1080, height: 1024 })

  // // Type into search box.
  await page.locator('#username').fill(process.env.CESAR_USERNAME)
  await page.locator('#password').fill(process.env.CESAR_PASSWORD)

  await page.locator('button').click()

  await page.waitForNavigation()

  //get PHPSESSID from cookies 
  const ssid = await page.cookies().then(cookies => {
    return cookies.find(cookie => cookie.name === 'PHPSESSID').value
  })

  return { ssid, browser, page }
}

export default login