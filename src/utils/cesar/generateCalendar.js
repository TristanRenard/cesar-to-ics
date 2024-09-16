import fs from "fs/promises"
import ical from "ical-generator"
import moment from "moment-timezone"

const generateCalendar = async (etd) => {
  try {

    const data = JSON.parse(etd)

    const calendar = ical()

    const localTz = 'Europe/Paris'

    data.forEach(course => {
      const start_utc = moment.utc(course.startDate)
      const end_utc = moment.utc(course.endDate)

      const start_local = start_utc.tz(localTz)
      const end_local = end_utc.tz(localTz)

      calendar.createEvent({
        summary: course.schoolSubject.name,
        start: start_local.toDate(),
        end: end_local.toDate(),
        location: course.rooms && course.rooms.length > 0
          ? `${course.rooms[0].name}, ${course.rooms[0].building.name}`
          : 'N/A',
        description: course.description || 'Pas de description.'
      })
    })

    try {
      await fs.access('output')
    } catch (error) {
      if (error.code === 'ENOENT') {
        await fs.mkdir('output')
      }
    }

    await fs.writeFile('output/calendar.ics', calendar.toString(), 'utf-8')

    console.log("Le fichier 'calendar.ics' a été généré avec succès.")
  } catch (error) {
    console.error("Une erreur s'est produite lors de la génération du fichier : ", error)
  }
}

export default generateCalendar