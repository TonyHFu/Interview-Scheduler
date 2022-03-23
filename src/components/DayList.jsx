import DayListItem from "./DayListItem";
import React from "react";

const DayList = (props) => {


  const days = props.days.map(day => {
    let selected = false;
    
    if (props.day === day.name) {
      selected = true;
    }
    return (
      <DayListItem 
        key={day.id}
        spots={day.spots}
        name={day.name}
        setDay={event => props.setDay(day.name)}
        selected={selected}
      />
    );
  });


  return (
    <ul>
      {days}
    </ul>
  );
}

export default DayList;
