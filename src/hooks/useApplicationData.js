import { useEffect, useReducer } from "react";
import axios from "axios";

export default function useApplicationData(initial) {

  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";
  const DELETE_INTERVIEW = "DELETE_INTERVIEW";
  const SET_DAYS = "SET_DAYS"

  const [state, dispatchAction] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  function reducer(state, action) {
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
      // case SPOTS: {
        
      //               const dayObj = state.days.filter(
      //                 day => day.name === state.day
      //               )[0];
      //               const day = {
      //                 ...dayObj,
      //                 spots: dayObj.spot + action.value
      //               };
      //               return { ...state, days: reMapDays(state.days, day) };
      //             }
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }

  const setDay = day => dispatchAction({type: SET_DAY, value: day });

  useEffect(() => {
    Promise.all([
      Promise.resolve(axios.get('/api/days')),
      Promise.resolve(axios.get('/api/appointments')),
      Promise.resolve(axios.get('/api/interviewers'))
    ]).then((all) => {
      dispatchAction({type: SET_APPLICATION_DATA, value: {days: all[0].data, appointments: all[1].data, interviewers: all[2].data } });
    });
  }, []);



  function cancelInterview(id) {

    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    }
    return Promise.resolve(axios.delete(`/api/appointments/${id}`))
      .then(response => {
        if (response.status === 204) {
          dispatchAction({type: DELETE_INTERVIEW, value: appointments})
        }
      
      })
      .then(() => {
        const dayObj = state.days.filter(day => day.name === state.day)[0];
        const day = {...dayObj, spots: dayObj.spots + 1};
        const days = state.days.map(d => {
          if (d.name === day.name) {
            return day
          }
          return d
        })
        dispatchAction({type: SET_DAYS, days: days})
      })
  };

  function bookInterview(id, interview) {

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return Promise.resolve(axios.put(`/api/appointments/${id}`, {interview}))
      .then((response) => {
        if (response.status === 204) { 
          dispatchAction({type: SET_INTERVIEW, value: appointments})
        }
      })
      .then(() => {
        const dayObj = state.days.filter(day => day.name === state.day)[0];
        const day = {...dayObj, spots: dayObj.spots - 1};
        const days = state.days.map(d => {
          if (d.name === day.name) {
            return day
          }
          return d
        })
        if (!state.appointments[id].interview) {
          dispatchAction({type: SET_DAYS, days: days})
        }
      })

      
  };

  return { state, setDay, bookInterview, cancelInterview }
}