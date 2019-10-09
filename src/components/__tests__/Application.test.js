import React from "react";

import {
  render,
  cleanup,
  waitForElement,
  fireEvent,
  getByText,
  prettyDOM,
  getAllByTestId,
  getByAltText,
  getByPlaceholderText,
  queryByText,
  queryByAltText,
  queryAllByText
} from "@testing-library/react";

import Application from "components/Application";

import axios from "axios";

afterEach(cleanup);

describe("Application", () => {
  it("changes the schedule when a new day is selected", async () => {
    //1. Render the application
    const { getByText } = render(<Application />);

    //2. Make sure Monday is Selected
    await waitForElement(() => getByText("Monday"));

    //3. Select Tuesday on the Day List
    fireEvent.click(getByText("Tuesday"));

    //4. Check Tuesday was selected by checking if Leopold is in the appointment list
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    //1. Render the application
    const { container, debug } = render(<Application />);

    //2. Sets appointment by grabbing the first container (empty)
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment")[0];

    //3. Clicks on the empty container's add button
    fireEvent.click(getByAltText(appointment, "Add"));

    //4. Clicks on the input field and changes it to the new student Name
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    //5. Clicks on target instructor
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    //6. Saves the new data
    fireEvent.click(getByText(appointment, "Save"));

    //7. Check Saving status pops up
    expect(getByText(appointment, "SAVING")).toBeInTheDocument();

    //8. Check that the data was saved correctly
    await waitForElement(() => queryByText(appointment, "Lydia Miller-Jones"));

    //9. Query for the day's spots left and make sure there are none remaining
    const day = getAllByTestId(container, "DayListItemID").find(day =>
      queryByText(day, "Monday")
    );
    await waitForElement(() => queryByText(day, "no spots remaining"));
  });

  it("loads data, deletes an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    //3. Click the "Delete" button on the Archie Cohen Appointment
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(queryByAltText(appointment, "Delete"));

    //4. Confirm the Transition to the confirm component
    expect(
      getByText(appointment, "Are you sure u wanna delete?")
    ).toBeInTheDocument();

    //5. Click to Confirm the deletion
    fireEvent.click(queryByText(appointment, "Confirm"));

    //6. Check the "DELETING" text is displayed
    expect(getByText(appointment, "DELETING")).toBeInTheDocument();

    //7. Confirm the appointment is no longer listed and the "add" button is displayed
    await waitForElement(() => queryByAltText(appointment, "Add"));

    //8. Check the DayListItem to make sure it's been updated with "2 spots remaining"
    const day = getAllByTestId(container, "DayListItemID").find(day =>
      queryByText(day, "Monday")
    );
    await waitForElement(() => queryByText(day, "2 spots remaining"));
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    //3. Click the "Edit" button on the Archie Cohen Appointment
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(queryByAltText(appointment, "Edit"));

    //4. Changes text to new student name - Lydia Miller-Jones
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    //5. Presses the save button
    fireEvent.click(getByText(appointment, "Save"));

    //6. Confirms Saving text
    expect(getByText(appointment, "SAVING")).toBeInTheDocument();

    //7. Confirms name is changed after save
    await waitForElement(() => queryByText(appointment, "Lydia Miller-Jones"));

    //8. Confirms spots have not changed (1 spot remaining)
    const day = getAllByTestId(container, "DayListItemID").find(day =>
      queryByText(day, "Monday")
    );
    expect(queryByText(day, "1 spots remaining"));
  });

  it("shows the save error when failing to save an appointment", async () => {
    //0. Reject the first put axios call (once)
    axios.put.mockRejectedValueOnce();

    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    //3. Click the "Edit" button on the Archie Cohen Appointment
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(queryByAltText(appointment, "Edit"));

    //4. Changes text to new student name - Lydia Miller-Jones
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    //5. Presses the save button
    fireEvent.click(getByText(appointment, "Save"));

    //6. Confirms Saving text
    expect(getByText(appointment, "SAVING")).toBeInTheDocument();

    //7. Wait for Error message
    await waitForElement(() => queryByText(appointment, "Error"));

    //8. Try and close error message when saving appointment
    fireEvent.click(queryByAltText(appointment, "Close"));

    //9. Takes you back to save screen
    expect(queryByText(appointment, "Save"));

    //10. Make sure spots haven't changed (1 spot remaining)
    const day = getAllByTestId(container, "DayListItemID").find(day =>
      queryByText(day, "Monday")
    );
    expect(queryByText(day, "1 spots remaining"));
  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();
    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    //3. Click the "Delete" button on the Archie Cohen Appointment
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(queryByAltText(appointment, "Delete"));

    //4. Confirm the Transition to the confirm component
    expect(
      getByText(appointment, "Are you sure u wanna delete?")
    ).toBeInTheDocument();

    //5. Click to Confirm the deletion
    fireEvent.click(queryByText(appointment, "Confirm"));
    
    //6. Check the "DELETING" text is displayed
    expect(getByText(appointment, "DELETING")).toBeInTheDocument();

    //7. Wait for Error Message
    await waitForElement(() => queryByText(appointment, "Error"));

    //8. Try and close error message when saving appointment
    fireEvent.click(queryByAltText(appointment, "Close"));

    //9. Takes you back to Appointment display
    await waitForElement(() => getByText(container, "Archie Cohen"));

    //10. Spots remained unchanged (1 spot left)
    const day = getAllByTestId(container, "DayListItemID").find(day =>
      queryByText(day, "Monday")
    );
    expect(queryByText(day, "1 spots remaining"));
  });
});
