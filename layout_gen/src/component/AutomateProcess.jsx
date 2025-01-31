import { idCollection } from "../data/idCollection";
import { useState, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function AutomateProcess({ onStartProcess, allImagesLoaded }) {
  const ids = idCollection.map((item) => item.id);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [downloaded, setDownloaded] = useState(false);
  const [processStarted, setProcessStarted] = useState(false);

  const handleStartProcess = () => {
    if (!processStarted) {
      setProcessStarted(true);
      onStartProcess(ids[currentIndex]);
    }
  };

  const generatePdf = async () => {
    const input = document.getElementById("divToPrint");

    await new Promise((resolve) => setTimeout(resolve, 500));

    return html2canvas(input, {
      scale: 4,
      useCORS: true,
      allowTaint: false,
    }).then((canvas) => {
      const imgWidth = 600;
      const imgHeight = 420;
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "l",
        unit: "mm",
        format: "a2",
      });
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`${ids[currentIndex]}.pdf`);
      setDownloaded(true);
    });
  };

  useEffect(() => {
    const processNextId = async () => {
      if (processStarted && allImagesLoaded && !downloaded) {
        await generatePdf();
      } else if (downloaded) {
        const nextIndex = currentIndex + 1;
        if (nextIndex < ids.length) {
          setDownloaded(false);
          setCurrentIndex(nextIndex);
          onStartProcess(ids[nextIndex]);
        } else {
          alert("All IDs processed!");
        }
      }
    };

    processNextId();
  }, [allImagesLoaded, downloaded, processStarted]);

  return (
    <>
      <button onClick={handleStartProcess} disabled={processStarted}>
        {processStarted ? "Processing..." : "Start process"}
      </button>
    </>
  );
}
