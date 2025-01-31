import "../design/DataCard.css";

export default function DataCard({ dayIndex, imageData }) {
  return (
    <>
      <div className="dataCard">
        <div className="dataCardHeader"> {dayIndex} </div>
        <div className="dataCardContent">
          <img
            src={imageData.imagePath ? imageData.imagePath : undefined}
            onLoad={imageData.onLoad}
          />
        </div>
      </div>
    </>
  );
}
