import { useEffect, useReducer } from "react";
import axios from "axios";
import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW,
  DELETE_INTERVIEW,
  SET_DAYS
} from "../reducers/application";

export default function useApplicationData(initial) {
  const [state, dispatchAction] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => dispatchAction({ type: SET_DAY, value: day });

  useEffect(() => {
    Promise.all([
      Promise.resolve(axios.get("/api/days")),
      Promise.resolve(axios.get("/api/appointments")),
      Promise.resolve(axios.get("/api/interviewers"))
    ]).then(all => {
      dispatchAction({
        type: SET_APPLICATION_DATA,
        value: {
          days: all[0].data,
          appointments: all[1].data,
          interviewers: all[2].data
        }
      });
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
    };
    return Promise.resolve(axios.delete(`/api/appointments/${id}`))
      .then(response => {
        if (response.status === 204) {
          dispatchAction({ type: DELETE_INTERVIEW, value: appointments });
        }
      })
      .then(() => {
        const dayObj = state.days.filter(day => day.name === state.day)[0];
        const day = { ...dayObj, spots: dayObj.spots + 1 };
        const days = state.days.map(d => {
          if (d.name === day.name) {
            return day;
          }
          return d;
        });
        dispatchAction({ type: SET_DAYS, days: days });
      });
  }

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return Promise.resolve(axios.put(`/api/appointments/${id}`, { interview }))
      .then(response => {
        if (response.status === 204) {
          dispatchAction({ type: SET_INTERVIEW, value: appointments });
        }
      })
      .then(() => {
        const dayObj = state.days.filter(day => day.name === state.day)[0];
        const day = { ...dayObj, spots: dayObj.spots - 1 };
        const days = state.days.map(d => {
          if (d.name === day.name) {
            return day;
          }
          return d;
        });
        if (!state.appointments[id].interview) {
          dispatchAction({ type: SET_DAYS, days: days });
        }
      });
  }

  return { state, setDay, bookInterview, cancelInterview };
}
