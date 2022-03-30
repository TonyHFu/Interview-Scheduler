import React from "react";

import {
	render,
	cleanup,
	waitForElement,
	fireEvent,
	prettyDOM,
	getByText,
	getAllByTestId,
	getByRole,
	getByPlaceholderText,
	getByAltText,
	queryByText,
} from "@testing-library/react";

import axios from "axios";

import Application from "components/Application";

afterEach(cleanup);
describe("Application", () => {
	it("defaults to Monday and changes the schedule when a new day is selected", () => {
		const { getByText } = render(<Application />);

		return waitForElement(() => getByText("Monday")).then(() => {
			fireEvent.click(getByText("Tuesday"));
			expect(getByText("Leopold Silvers")).toBeInTheDocument();
		});
	});

	it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
		const { container } = render(<Application />);
		await waitForElement(() => getByText(container, "Archie Cohen"));

		const appointments = getAllByTestId(container, "appointment");

		const appointment = appointments[0];

		fireEvent.click(getByAltText(appointment, "Add"));

		fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
			target: { value: "Lydia Miller-Jones" },
		});

		fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

		fireEvent.click(getByText(appointment, "Save"));

		expect(getByText(appointment, "Saving")).toBeInTheDocument();

		await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

		const day = getAllByTestId(container, "day").find(day =>
			queryByText(day, "Monday")
		);

		expect(getByText(day, "no spots remaining")).toBeInTheDocument();
	});

	it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
		//1. Render the application

		const { container } = render(<Application />);

		//2. Wait until the data is loaded (Archie Cohen is displayed)

		await waitForElement(() => getByText(container, "Archie Cohen"));

		const appointment = getAllByTestId(container, "appointment").find(
			appointment => queryByText(appointment, "Archie Cohen")
		);

		//3. Click the "Delete" button on the Archie Cohen appointment

		fireEvent.click(getByAltText(appointment, "Delete"));

		//4. Check that confirmation message is shown

		expect(
			getByText(appointment, "Are you sure you would like to delete?")
		).toBeInTheDocument();
		//5. Click confirm

		fireEvent.click(getByText(appointment, "Confirm"));

		//6. CHeck that deleting is now shown

		expect(getByText(appointment, "Deleting")).toBeInTheDocument();
		//7. Wait until the Add button is now rendered

		await waitForElement(() => getByAltText(appointment, "Add"));

		//8. Check that spots remaining is now 2

		const day = getAllByTestId(container, "day").find(day =>
			queryByText(day, "Monday")
		);

		expect(getByText(day, "2 spots remaining"));
	});

	it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
		//1. renders application
		const { container } = render(<Application />);

		//2. waits until Archie Cohen is displayed
		await waitForElement(() => getByText(container, "Archie Cohen"));

		//3. Clicks Edit Button
		const appointment = getAllByTestId(container, "appointment").find(
			appointment => queryByText(appointment, "Archie Cohen")
		);
		fireEvent.click(getByAltText(appointment, "Edit"));

		//4. Checks that Save and Cancel buttons are there
		expect(getByText(appointment, "Cancel")).toBeInTheDocument();
		expect(getByText(appointment, "Save")).toBeInTheDocument();

		//5. Changes the student name to Tony and interviewer selection to Sylvia

		fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
			target: { value: "Tony" },
		});
		fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

		//6. Click save

		fireEvent.click(getByText(appointment, "Save"));

		//7. Check that Saving is displayed

		expect(getByText(appointment, "Saving")).toBeInTheDocument();

		//8. Check that Tony and Sylvia are in that appointment

		await waitForElement(() => getByText(appointment, "Tony"));

		expect(getByText(appointment, "Sylvia Palmer")).toBeInTheDocument();

		//9. Check that spots remaining is still 1.

		const day = getAllByTestId(container, "day").find(day =>
			queryByText(day, "Monday")
		);

		expect(getByText(day, "1 spot remaining"));
	});

	it("shows the save error when failing to save an appointment", async () => {
		axios.put.mockRejectedValueOnce();

		//1. renders application
		const { container } = render(<Application />);

		//1.5 wait until archie cohen

		await waitForElement(() => getByText(container, "Archie Cohen"));

		//2. click the add button in appoint 1
		const appointments = getAllByTestId(container, "appointment");

		const appointment = appointments[0];

		fireEvent.click(getByAltText(appointment, "Add"));
		//3. enter student name as Lydia Miller-Jones and interviewer as Sylvia Palmer
		fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
			target: { value: "Lydia Miller-Jones" },
		});

		fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
		//4. click save
		fireEvent.click(getByText(appointment, "Save"));

		//5. shows saving?
		expect(getByText(appointment, "Saving")).toBeInTheDocument();

		//6. displays error

		await waitForElement(() =>
			getByText(appointment, "There was an error saving your appointment")
		);
		expect(
			getByText(appointment, "There was an error saving your appointment")
		);
		//7. click X on error

		fireEvent.click(getByAltText(appointment, "Close"));

		//8. shows Empty

		expect(getByAltText(appointment, "Add")).toBeInTheDocument();

		//9. shows spots remaining as still 1

		const day = getAllByTestId(container, "day").find(day =>
			queryByText(day, "Monday")
		);

		expect(getByText(day, "1 spot remaining")).toBeInTheDocument();

		// console.log(prettyDOM(appointment));
	});

	it("shows the delete error when failing to delete an existing appointment", async () => {
		axios.delete.mockRejectedValueOnce();

		//1. renders application
		const { container } = render(<Application />);

		//1.5 wait until archie cohen

		await waitForElement(() => getByText(container, "Archie Cohen"));

		//2. click the delete button in appoint with archie cohen
		const appointment = getAllByTestId(container, "appointment").find(
			appointment => queryByText(appointment, "Archie Cohen")
		);
		fireEvent.click(getByAltText(appointment, "Delete"));

		//3. Check that confirmation message is shown

		expect(
			getByText(appointment, "Are you sure you would like to delete?")
		).toBeInTheDocument();
		//4. Click confirm

		fireEvent.click(getByText(appointment, "Confirm"));

		//5. CHeck that deleting is now shown

		expect(getByText(appointment, "Deleting")).toBeInTheDocument();

		//6. displays error

		await waitForElement(() =>
			getByText(appointment, "There was an error deleting your appointment")
		);
		expect(
			getByText(appointment, "There was an error deleting your appointment")
		);
		//7. click X on error

		fireEvent.click(getByAltText(appointment, "Close"));

		//8. shows delete button still

		expect(getByAltText(appointment, "Delete")).toBeInTheDocument();

		//9. shows spots remaining as still 1

		const day = getAllByTestId(container, "day").find(day =>
			queryByText(day, "Monday")
		);

		expect(getByText(day, "1 spot remaining")).toBeInTheDocument();

		// console.log(prettyDOM(appointment));
	});
});
