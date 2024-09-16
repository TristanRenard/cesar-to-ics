import fs from 'fs/promises'
import ical from "ical-generator"

const normalizeText = (text) => {
  // Replace multiple spaces or line breaks with a single space
  return text.replace(/\s+/g, ' ').trim()
}

const parseDate = (dateString) => {
  // Regex to match single dates like "Le Monday, September 16, 2025"
  const singleDateRegex = /Le \w+, (\w+ \d{1,2}, \d{4})/

  // Regex to match date ranges like "Entre le 16 et le Jun 27, 2025"
  const rangeDateWithYearRegex = /Entre le (\d{1,2}) et le (\w+ \d{1,2}),? (\d{4})/

  // Regex to match full date ranges like "Entre le 16 Sep et le Oct 18, 2025"
  const fullRangeDateRegex = /Entre le (\d{1,2} \w+) et le (\w+ \d{1,2}, \d{4})/

  let startDate = null
  let endDate = null

  if (singleDateRegex.test(dateString)) {
    const [, datePart] = singleDateRegex.exec(dateString)
    startDate = endDate = new Date(datePart)
  } else if (rangeDateWithYearRegex.test(dateString)) {
    const [, startDay, endPart, year] = rangeDateWithYearRegex.exec(dateString)
    const [endMonth, endDay] = endPart.split(' ')
    startDate = new Date(`${endMonth} ${startDay}, ${year}`)
    endDate = new Date(`${endPart}, ${year}`)
  } else if (fullRangeDateRegex.test(dateString)) {
    const [, startPart, endPart] = fullRangeDateRegex.exec(dateString)
    const year = new Date(endPart).getFullYear()
    startDate = new Date(`${startPart}, ${year}`)
    endDate = new Date(endPart)
  } else {
    console.log(`Unrecognized date format: ${dateString}`)
  }

  return { startDate, endDate }
}




const getKeyDates = async (page) => {
  console.log("Navigating to key dates page...")
  await page.goto('https://cesar.emineo-informatique.fr/student-sheet')

  console.log("Waiting for page to load...")

  await page.waitForSelector('.booklet.row.g-3')

  console.log("Page loaded.")

  const phases = await page.$$('.booklet-phase')

  console.log("Extracting key dates...")

  const events = []

  for (const phase of phases) {
    const titleElement = await phase.$('.card-title')
    const rawDateText = await phase.$eval('.card-text', el => el.textContent)
    const dateText = normalizeText(rawDateText)
    const backgroundColor = await phase.evaluate(el => el.style.backgroundColor)

    let title = (await titleElement.evaluate(el => el.textContent)).trim()
    const linkElement = await titleElement.$('a')
    let link = null
    if (linkElement) {
      title = (await linkElement.evaluate(el => el.textContent)).trim()
      link = await linkElement.evaluate(el => el.href)
    }

    const description = await titleElement.evaluate(el => el.getAttribute('data-bs-title')) || 'Pas de description.'

    const { startDate, endDate } = parseDate(dateText)

    if (startDate && endDate) {
      const event = {
        title: title,
        startDate: startDate,
        endDate: endDate,
        color: backgroundColor,
        link: link,
        description: description
      }
      events.push(event)
    } else {
      console.log(`Could not parse dates for: ${title}`)
    }
  }

  const calendar = ical()
  const localTz = 'Europe/Paris'

  events.forEach(event => {
    calendar.createEvent({
      summary: event.title,
      start: event.startDate,
      end: event.endDate,
      location: event.link || 'N/A',
      description: event.description,
      color: event.color
    })
  })

  try {
    await fs.access('output')
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.mkdir('output')
    }
  }

  await fs.writeFile('output/calendarKeyDates.ics', calendar.toString(), 'utf-8')
  console.log('Calendar saved as output/calendarKeyDates.ics')
}

export default getKeyDates
