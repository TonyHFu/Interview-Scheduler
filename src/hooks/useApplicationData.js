import { useReducer, useEffect } from "react";
import axios from "axios";
const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

export default function useApplicationData() {

  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY:
        return { 
          ...state, 
          day: action.day 
        };
      case SET_APPLICATION_DATA:
        return {
          ...state,
          appointments: action.appointments,
          days: action.days,
          interviewers: action.interviewers
        };
      case SET_INTERVIEW:
        return {
          ...state,
          appointments: action.appointments,
          days: action.days
        }; 
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }
  
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  
  const setDay = day => dispatch({ type: SET_DAY, day });

  const updateSpots = function(state, appointments) {

    const thisDay = state.days.filter(currentDay => currentDay.name === state.day);
    const appointmentsArr = thisDay[0].appointments.map(currentAppointment => appointments[currentAppointment]);
  
    
    const spots = appointmentsArr.reduce((spots, appointment) => {
      if (appointment.interview === null) {
        return spots + 1;
      }
      return spots;
    }, 0)
  
    const newDays = state.days.map(currentDay => {
      if (currentDay.name === state.day) {
        return {
          ...currentDay,
          spots
        }
      }
      return currentDay;
    })
    
    return newDays;
  };
  
  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    }
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const days = updateSpots(state, appointments);

    return axios.put(`/api/appointments/${id}`, { interview })
      .then(() => {
        dispatch({ type: SET_INTERVIEW, appointments, days });
      });
  }
  
  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    const days = updateSpots(state, appointments);
    
    return axios.delete(`/api/appointments/${id}`)
      .then(() => {
        dispatch({ type: SET_INTERVIEW, appointments, days });
      });
  }

  useEffect(() => {
    Promise.all([
      axios.get(`/api/days`),
      axios.get(`/api/appointments`),
      axios.get(`/api/interviewers`)
    ])
      .then(responses => {
        dispatch({ 
          type: "SET_APPLICATION_DATA", 
          days: responses[0].data, 
          appointments: responses[1].data,
          interviewers: responses[2].data 
        });
        
      })
  }, []);

  return { state, setDay, bookInterview, cancelInterview, dispatch };
}
