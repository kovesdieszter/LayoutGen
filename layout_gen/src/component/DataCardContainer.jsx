import { useState, useEffect } from "react";
import "../design/DataCardContainer.css";
import DataCard from "./DataCard";
import LoadingModal from "./LoadingModal";

export default function DataCardContainer({
  monthData,
  id,
  setRequestCode,
  setAllImagesLoaded,
}) {
  const [imageData, setImageData] = useState([]);
  const [code, setCode] = useState("");
  const [loadedImagesCount, setLoadedImagesCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchImages = async (pageToken = null, accumulatedData = []) => {
      setLoading(true);
      let url = `https://storage.googleapis.com/storage/v1/b/planet_saar_geodata/o?prefix=layout_500/`;
      if (pageToken) {
        url += `&pageToken=${pageToken}`;
      }

      try {
        const response = await fetch(url, {
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const currentItems = data.items.map((item) => item.name);
        const allItems = [...accumulatedData, ...currentItems];

        if (data.nextPageToken) {
          return fetchImages(data.nextPageToken, allItems);
        }

        return allItems;
      } catch (error) {
        console.log("Error fetching images", error);
        return accumulatedData; 
      }
    };

    const filterAndSetImages = async () => {
      const allImages = await fetchImages();
      const filteredImages = allImages.filter((name) => {
        const regex = new RegExp(`_${id}_`);
        return regex.test(name);
      });

      setImageData(filteredImages);

      if (filteredImages.length > 0) {
        const sampleImage = filteredImages[0];
        const parts = sampleImage.split("/")[1].split("_");
        const codeMatch = parts[2].match(/\d{3}\.jpg/);
        if (codeMatch) {
          const code = codeMatch[0].slice(0, 3);
          setCode(code);
          setRequestCode(code);
        }
      }
      setLoading(false);
    };

    filterAndSetImages();
  }, [id, setRequestCode]);

  useEffect(() => {
    if (loadedImagesCount === imageData.length) {
      setAllImagesLoaded(true);
    }
  }, [loadedImagesCount, imageData.length, setAllImagesLoaded]);

  const handleImageLoad = () => {
    setLoadedImagesCount((prevCount) => prevCount + 1);
  };

  return (
    <div className="dataCardContainer">
      {monthData.map(({ monthIndex, numberOfDays }, monthArrayIndex) => (
        <div key={monthIndex} className="monthDataCardRow">
          {Array.from({ length: numberOfDays }).map((_, dayIndex) => {
            const previousDays = monthData
              .slice(0, monthArrayIndex)
              .reduce((sum, month) => sum + month.numberOfDays, 0);
            const globalDayIndex = previousDays + dayIndex + 1;

            const imageName = `layout_500/${globalDayIndex
              .toString()
              .padStart(3, "0")}_${id}_${code}.jpg`;

            const imageSrc = imageData.find((img) => img.includes(imageName));
            const imageUrl = imageSrc
              ? `https://storage.googleapis.com/planet_saar_geodata/${imageSrc}`
              : null;

            return (
              <DataCard
                key={dayIndex}
                dayIndex={globalDayIndex}
                imageData={{
                  imagePath: imageUrl,
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
