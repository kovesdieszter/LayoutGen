import "../design/MonthCard.css";

export default function MonthCard({ monthIndex }) {
  return (
    <>
      <div className="monthCard">{monthIndex}</div>
    </>
  );
}
