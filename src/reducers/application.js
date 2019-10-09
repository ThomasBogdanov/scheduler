const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";
const DELETE_INTERVIEW = "DELETE_INTERVIEW";
const SET_DAYS = "SET_DAYS"


export default  function reducer(state, action) {
  switch (action.type) {
    case SET_DAY:
      return ({...state, day: action.value})
    case SET_APPLICATION_DATA:
      return ({...state, days: action.value.days, appointments: action.value.appointments, interviewers: action.value.interviewers})
    case SET_INTERVIEW: {
      return ({...state, appointments: action.value})
    }
    case DELETE_INTERVIEW: {
      return ({...state, appointments: action.value})
    }
    case SET_DAYS: {
      return ({...state, days: action.days})
    }
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}