import React from "react";

import { render, cleanup, getByText } from "@testing-library/react";

import Appointment from "components/Appointment";

describe("Appointment", () => {
	it("renders Appointment", () => {
		render(<Appointment />);
	});
});
