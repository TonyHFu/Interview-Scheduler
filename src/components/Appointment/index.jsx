import "components/Appointment/styles.scss";
import React from "react";


import Show from "./Show";
import Header from "./Header";
import Empty from "./Empty";

export default function Appointment(props) {
  return (
    <article className="appointment">
      <Header time={props.time} />
      {props.interview ? <Show interviewer={props.interview.interviewer} student={props.interview.student}/> : <Empty />}
    </article>
  );
};