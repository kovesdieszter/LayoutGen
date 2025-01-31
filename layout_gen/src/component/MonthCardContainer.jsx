import MonthCard from "./MonthCard";
import "../design/MonthCardContainer.css";

export default function MonthCardContainer({ monthData }) {
  return (
    <>
      <div className="monthCardContainer">
        {monthData.map(({ monthIndex }) => (
          <MonthCard key={monthIndex} monthIndex={monthIndex} />
        ))}
      </div>
    </>
  );
}
