import React from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "../design/Form.css";

import "../design/Header.css";

export default function ImgCreator() {
  const printDocument = () => {
    const input = document.getElementById("divToPrint");

   
    html2canvas(input, {
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

     
      const x = 0;
      const y = 0;
      pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);

     
      pdf.save("download.pdf");
    });
  };

  return (
    <div>
      <button className="download genButton" onClick={printDocument}>
        Download PDF
      </button>
    </div>
  );
}
