import React, { useState } from "react";
import InterviewerListItem from "./InterviewerListItem";
import "components/InterviewerList.scss";


export default function InterviewerList(props) {
  
  const [interviewer, setInterviewer] = useState(props.interviewer);

  const interviewers = props.interviewers.map(eachInterviewer => {
    return <InterviewerListItem
      key={eachInterviewer.id}
      name={eachInterviewer.name}
      avatar={eachInterviewer.avatar}
      setInterviewer={() => props.onChange(eachInterviewer.id)}
      selected={eachInterviewer.id === props.value}
    />
  })
  return(
    <section className="interviewers">
      <h4 className="interviewers__header text--light">
        Interviewer
      </h4>
      <ul className="interviewers__list">
        {interviewers}
      </ul>
    </section>
  );
};
