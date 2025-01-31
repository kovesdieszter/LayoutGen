import { useState, useEffect } from "react";
import "../design/DataCardContainer.css";
import DataCard from "./DataCard";

const images = importAll(
  require.context("../assets/fix_cropped_images", false, /\.(jpg|jpeg)$/)
);

function importAll(r) {
  let images = {};
  r.keys().map((item, index) => {
    images[item.replace("./", "")] = r(item);
  });
  return images;
}

export default function DataCardContainer({
  monthData,
  id,
  setRequestCode,
  setAllImagesLoaded,
}) {
  const [imageData, setImageData] = useState([]);
  const [code, setCode] = useState("");
  const [loadedImagesCount, setLoadedImagesCount] = useState(0);

  useEffect(() => {
    const filteredImages = Object.keys(images).filter((key) =>
      key.includes(`${id}`)
    );
    setImageData(filteredImages);

    if (filteredImages.length > 0) {
      const sampleImage = filteredImages[0];
      const codeMatch = sampleImage.match(new RegExp(`_${id}_(\\d{3})\\.jpg$`));
      if (codeMatch) {
        setCode(codeMatch[1]);
        setRequestCode(codeMatch[1]);
      }
    }
  }, [id]);

  const handleImageLoad = () => {
    setLoadedImagesCount((prevCount) => prevCount + 1);
  };

  useEffect(() => {
    if (loadedImagesCount === imageData.length) {
      setAllImagesLoaded(true);
    }
  }, [loadedImagesCount, imageData.length, setAllImagesLoaded]);

  return (
    <div className="dataCardContainer">
      {monthData.map(({ monthIndex, numberOfDays }, monthArrayIndex) => (
        <div key={monthIndex} className="monthDataCardRow">
          {Array.from({ length: numberOfDays }).map((_, dayIndex) => {
            const previousDays = monthData
              .slice(0, monthArrayIndex)
              .reduce((sum, month) => sum + month.numberOfDays, 0);
            const globalDayIndex = previousDays + dayIndex + 1;

            const imageName = `${globalDayIndex
              .toString()
              .padStart(3, "0")}_${id}_${code}.jpg`;

            const imageSrc = imageData.find((img) => img.includes(imageName));
            return (
              <DataCard
                key={dayIndex}
                dayIndex={globalDayIndex}
                imageData={{
                  imagePath: images[imageSrc],
                  onLoad: handleImageLoad,
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
