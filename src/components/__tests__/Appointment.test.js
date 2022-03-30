import React from "react";

import { render, cleanup, getByText } from "@testing-library/react";

import Appointment from "components/Appointment";

describe("Application", () => {
	it("renders Appointment", () => {
		render(<Appointment />);
	});
});
