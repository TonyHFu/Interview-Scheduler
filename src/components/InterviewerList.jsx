import React from "react";
import InterviewerListItem from "./InterviewerListItem";
import "components/InterviewerList.scss";
import PropTypes from 'prop-types';

function InterviewerList(props) {
  

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

InterviewerList.propTypes = {
  interviewers: PropTypes.array.isRequired
};

export default InterviewerList;