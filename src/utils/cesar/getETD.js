const getCalendar = async (page) => {
  await page.goto('https://cesar.emineo-informatique.fr/schedule')
  // get data-tui-calendar-event-lesson-schedules-value attribut by class ".card w-100 position-static"
  const data = await page.$$eval('.card.w-100.position-static', elements => {
    return elements.map(element => {
      return element.getAttribute('data-tui-calendar-event-lesson-schedules-value')
    })
  })

  return data
}

export default getCalendar