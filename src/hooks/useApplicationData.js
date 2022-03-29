import { useReducer, useEffect } from "react";
import axios from "axios";
const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

export default function useApplicationData() {

  function reducer(state, action) {

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
        const appointment = {
          ...state.appointments[action.id],
          interview: action.interview
        }
        const appointments = {
          ...state.appointments,
          [action.id]: appointment
        };

        const days = updateSpots(state, appointments);
        
        return {
          ...state,
          appointments,
          days
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

  
  
  function bookInterview(id, interview) {
    return axios.put(`/api/appointments/${id}`, { interview })
      .then(() => {
        dispatch({ type: SET_INTERVIEW, id, interview });
      });
  }
  
  function cancelInterview(id) {
    return axios.delete(`/api/appointments/${id}`)
      .then(() => {
        dispatch({ type: SET_INTERVIEW, id, interview: null });
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

  useEffect(() => {
    const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    webSocket.onmessage = function(event) {
      const socketCommand = JSON.parse(event.data);
      if (socketCommand.type === "SET_INTERVIEW") {
        dispatch({ ...socketCommand })
      }
    }
    
  }, [])

  return { state, setDay, bookInterview, cancelInterview, dispatch };
}
