const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

function reducer(state, action) {
	const updateSpots = function (state, appointments, setInterviewDay) {
		const thisDay = state.days.filter(
			currentDay => currentDay.name === setInterviewDay
		);
		const appointmentsArr = thisDay[0].appointments.map(
			currentAppointment => appointments[currentAppointment]
		);

		const spots = appointmentsArr.reduce((spots, appointment) => {
			if (appointment.interview === null) {
				return spots + 1;
			}
			return spots;
		}, 0);

		const newDays = state.days.map(currentDay => {
			if (currentDay.name === setInterviewDay) {
				return {
					...currentDay,
					spots,
				};
			}
			return currentDay;
		});

		return newDays;
	};

	switch (action.type) {
		case SET_DAY:
			return {
				...state,
				day: action.day,
			};
		case SET_APPLICATION_DATA:
			return {
				...state,
				appointments: action.appointments,
				days: action.days,
				interviewers: action.interviewers,
			};
		case SET_INTERVIEW:
			const appointment = {
				...state.appointments[action.id],
				interview: action.interview,
			};
			const appointments = {
				...state.appointments,
				[action.id]: appointment,
			};

			const setInterviewDay = state.days.reduce((acc, currentDay) => {
				if (acc) return acc;

				currentDay.appointments.forEach(currentDayAppointments => {
					if (currentDayAppointments === action.id) {
						acc = currentDay.name;
					}
				});

				return acc;
			}, null);

			const days = updateSpots(state, appointments, setInterviewDay);

			return {
				...state,
				appointments,
				days,
			};

		default:
			throw new Error(
				`Tried to reduce with unsupported action type: ${action.type}`
			);
	}
}

export default reducer;

export { SET_DAY, SET_APPLICATION_DATA, SET_INTERVIEW };
