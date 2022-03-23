import DayListItem from "./DayListItem";
import React from "react";

const DayList = (props) => {


  const days = props.days.map(day => {
    
    return (
      <DayListItem 
        key={day.id}
        spots={day.spots}
        name={day.name}
        setDay={event => props.onChange(day.name)}
        selected={props.value === day.name}
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
