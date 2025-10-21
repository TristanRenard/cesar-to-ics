import fs from 'fs/promises'
import ical from 'ical-generator'

const normalizeText = (text) => {
  return text.replace(/\s+/g, ' ').trim()
}

const parseDate = (dateString) => {
  // Regex pour les dates françaises
  const singleDateRegex = /Le (\w+) (\d{1,2}) (\w+) (\d{4})/
  const singleDateShortRegex = /Le (\w+) (\d{1,2}) (\w+)\.? (\d{4})/
  const rangeDateRegex = /Entre le (\d{1,2}) (\w+)\.? et le (\d{1,2}) (\w+)\.? (\d{4})/
  const rangeDateWithoutMonthRegex = /Entre le (\d{1,2}) et le (\d{1,2}) (\w+)\.? (\d{4})/

  // Mapping des mois français
  const monthMap = {
    'janv': '01',
    'janvier': '01',
    'févr': '02',
    'février': '02',
    'mars': '03',
    'avr': '04',
    'avril': '04',
    'mai': '05',
    'juin': '06',
    'juil': '07',
    'juillet': '07',
    'août': '08',
    'sept': '09',
    'septembre': '09',
    'oct': '10',
    'octobre': '10',
    'nov': '11',
    'novembre': '11',
    'déc': '12',
    'décembre': '12'
  }

  const getMonthNumber = (monthStr) => {
    const normalized = monthStr.toLowerCase().replace('.', '')
    return monthMap[normalized] || '01'
  }

  let startDate = null
  let endDate = null

  if (singleDateRegex.test(dateString) || singleDateShortRegex.test(dateString)) {
    const match = singleDateRegex.exec(dateString) || singleDateShortRegex.exec(dateString)
    if (match) {
      const [, , day, month, year] = match
      const monthNum = getMonthNumber(month)
      startDate = endDate = new Date(`${year}-${monthNum}-${day.padStart(2, '0')}`)
    }
  } else if (rangeDateRegex.test(dateString)) {
    const match = rangeDateRegex.exec(dateString)
    if (match) {
      const [, startDay, startMonth, endDay, endMonth, year] = match
      const startMonthNum = getMonthNumber(startMonth)
      const endMonthNum = getMonthNumber(endMonth)
      startDate = new Date(`${year}-${startMonthNum}-${startDay.padStart(2, '0')}`)
      endDate = new Date(`${year}-${endMonthNum}-${endDay.padStart(2, '0')}`)
    }
  } else if (rangeDateWithoutMonthRegex.test(dateString)) {
    const match = rangeDateWithoutMonthRegex.exec(dateString)
    if (match) {
      const [, startDay, endDay, month, year] = match
      const monthNum = getMonthNumber(month)
      startDate = new Date(`${year}-${monthNum}-${startDay.padStart(2, '0')}`)
      endDate = new Date(`${year}-${monthNum}-${endDay.padStart(2, '0')}`)
    }
  } else {
    console.log(`Format de date non reconnu: ${dateString}`)
  }

  return { startDate, endDate }
}

const getKeyDates = async (page) => {
  console.log("Navigation vers la page des dates clés...")
  await page.goto('https://cesar.emineo-informatique.fr/fiche-etudiant')

  console.log("Attente du chargement de la page...")
  await page.waitForSelector('.booklet')
  console.log("Page chargée.")

  const phases = await page.$$('.booklet-phase')
  console.log("Extraction des dates clés...")

  const events = []

  for (const phase of phases) {
    const titleElement = await phase.$('.card-title')
    if (!titleElement) continue

    // Vérifier si .card-text existe
    const dateTextElement = await phase.$('.card-text')
    if (!dateTextElement) {
      console.log(`Pas de date trouvée pour cette phase, ignorée`)
      continue
    }

    const rawDateText = await dateTextElement.evaluate((el) => el.textContent)
    if (!rawDateText) continue

    const dateText = normalizeText(rawDateText)
    const backgroundColor = await phase.evaluate((el) => el.style.backgroundColor)

    let title = (await titleElement.evaluate((el) => el.textContent))?.trim() || ''
    const linkElement = await titleElement.$('a')
    let link = null

    if (linkElement) {
      title = (await linkElement.evaluate((el) => el.textContent))?.trim() || title
      link = await linkElement.evaluate((el) => el.href)
    }

    const description = await titleElement.evaluate((el) =>
      el.getAttribute('data-bs-title')
    ) || 'Pas de description.'

    const { startDate, endDate } = parseDate(dateText)

    if (startDate && endDate) {
      const event = {
        title,
        startDate,
        endDate,
        color: backgroundColor,
        link,
        description
      }
      events.push(event)
    } else {
      console.log(`Impossible de parser les dates pour: ${title}`)
    }
  }

  const calendar = ical({ name: 'Dates clés CESAR' })

  events.forEach((event) => {
    calendar.createEvent({
      summary: event.title,
      start: event.startDate,
      end: event.endDate,
      location: event.link || 'N/A',
      description: event.description,
      timezone: 'Europe/Paris'
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
  console.log('Calendrier sauvegardé dans output/calendarKeyDates.ics')
}

export default getKeyDates