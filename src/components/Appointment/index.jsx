import "components/Appointment/styles.scss";
import React from "react";

export default function Appointment(props) {
  return (
    <article className="appointment">
      {!props.time && 'No Appointments'}
      {props.time && `Appointment at ${props.time}`}
    </article>
  );
};