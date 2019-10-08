export function getAppointmentsForDay(state, day) {
  const filteredDaysObject = state.days.filter((current) => current.name === day)
  
  if (filteredDaysObject.length === 0) {
    return filteredDaysObject;
  }
  
  const getAppointments = filteredDaysObject[0].appointments.map(currentId => state.appointments[currentId])
  return getAppointments;
}

export function getInterview(state, interview) {
  if(!interview) {
    return null;
  } else {
    return {
      student: interview.student,
      interviewer: state.interviewers[interview.interviewer]
}}};

// export function getInterviewersForDay(state, day) {
//   const filteredDaysObject = state.days.filter((current) => current.name === day)
  
//   if (filteredDaysObject.length === 0) {
//     return filteredDaysObject;
//   }
//   const getInterviewers = filteredDaysObject[0].interviews.map((currentInterview) => currentInterview.interviewer)
//   const getInterviewersFinal = getInterviewers.map((currentInterviewNum) => state.interviewers[currentInterviewNum])
//   return getInterviewersFinal;
// }

export function getInterviewersForDay(state, day) {
  const filteredDaysObject = state.days.filter((current) => current.name === day)
  
  if (filteredDaysObject.length === 0) {
    return filteredDaysObject;
  }
  
  const getInterviewersFinal = filteredDaysObject[0].interviewers.map(currentId => state.interviewers[currentId])
  return getInterviewersFinal;
}





