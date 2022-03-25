export function getAppointmentsForDay(state, day) {
  if (state.days.length === 0) {
    return [];
  }
  
  const dayArr = state.days.filter(currentDay => currentDay.name === day);

  if (dayArr.length === 0) {
    return [];
  } 
  
  return dayArr[0].appointments.map(currentAppointment => state.appointments[currentAppointment]);    
}

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }
  const interviewer = state.interviewers[interview.interviewer];
  return {
    student: interview.student,
    interviewer
  }
}

export function getInterviewersForDay(state, day) {
  if (state.days.length === 0) {
    return [];
  }
  
  const dayArr = state.days.filter(currentDay => currentDay.name === day);

  if (dayArr.length === 0) {
    return [];
  } 
  
  return dayArr[0].interviewers.map(currentInterviewer => state.interviewers[currentInterviewer]);    
}