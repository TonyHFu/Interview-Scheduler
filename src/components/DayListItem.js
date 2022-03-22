import React from "react";
import "components/DayListItem.scss";
import classNames from "classnames";


export default function DayListItem(props) {
  const itemClasses = classNames('day-list__item', {
    'day-list__item--selected': props.selected,
    'day-list__item--full': props.spots === 0
  });

  const formatSpots = (spots) => {
    switch(spots) {
      case 1:
        return "1 spot";
      case 0:
        return "no spots";
      default:
        return spots + ' spots';
    }
  };

  const numSpots = formatSpots(props.spots);
  
  return (
    <li
      onClick={() => props.setDay(props.name)}
      className={itemClasses}
    >
      <h2 className="text--regular">{props.name}</h2> 
      <h3 className="text--light">{numSpots} remaining</h3>
    </li>
  );
}