import DataCardContainer from "./DataCardContainer";
import MonthCardContainer from "./MonthCardContainer";
import "../design/CardContainer.css";
import { useState } from "react";

export default function CardContainer({
  id,
  setRequestCode,
  setAllImagesLoaded,
}) {
  const [monthData, setMonthData] = useState([]);

  useState(() => {
    const data = Array.from({ length: 12 }).map((_, index) => {
      const numberOfDays = getNumberOfDaysInMonth(index + 1, 2024);
      return { monthIndex: index + 1, numberOfDays };
    });
    setMonthData(data);
  });

  function getNumberOfDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  return (
    <div className="cardContainer">
      <MonthCardContainer monthData={monthData} />
      <DataCardContainer
        monthData={monthData}
        id={id}
        setRequestCode={setRequestCode}
        setAllImagesLoaded={setAllImagesLoaded}
      />
    </div>
  );
}
