export function getAppointmentsForDay(state, day) {
  state.days.filter(currentDay => currentDay.name === day)
}