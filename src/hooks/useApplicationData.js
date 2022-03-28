import { useState } from "react";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  
  const setDay = day => setState({ ...state, day });

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
        setState({
          ...state,
          appointments,
          days
        });
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
        setState({
          ...state,
          appointments,
          days
        })
      });
  }

  return { state, setDay, bookInterview, cancelInterview, setState };
}
