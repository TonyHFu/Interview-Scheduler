import { useReducer, useEffect } from "react";
import axios from "axios";
import reducer, {
	SET_DAY,
	SET_APPLICATION_DATA,
	SET_INTERVIEW,
} from "reducers/application";

export default function useApplicationData() {
	const [state, dispatch] = useReducer(reducer, {
		day: "Monday",
		days: [],
		appointments: {},
		interviewers: {},
	});

	const setDay = day => dispatch({ type: SET_DAY, day });

	function bookInterview(id, interview) {
		return axios.put(`/api/appointments/${id}`, { interview }).then(() => {
			dispatch({ type: SET_INTERVIEW, id, interview });
		});
	}

	function cancelInterview(id) {
		return axios.delete(`/api/appointments/${id}`).then(() => {
			dispatch({ type: SET_INTERVIEW, id, interview: null });
		});
	}

	useEffect(() => {
		Promise.all([
			axios.get(`/api/days`),
			axios.get(`/api/appointments`),
			axios.get(`/api/interviewers`),
		]).then(responses => {
			dispatch({
				type: SET_APPLICATION_DATA,
				days: responses[0].data,
				appointments: responses[1].data,
				interviewers: responses[2].data,
			});
		});
	}, []);

	useEffect(() => {
		const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

		webSocket.onmessage = function (event) {
			const socketCommand = JSON.parse(event.data);
			if (socketCommand.type === "SET_INTERVIEW") {
				dispatch({ ...socketCommand });
			}
		};
	}, []);

	return { state, setDay, bookInterview, cancelInterview, dispatch };
}
