import { useState } from "react";
import CardContainer from "./CardContainer";
import Header from "./Header";

import AutomateProcess from "./AutomateProcess";

export default function MainLayout() {
  const [id, setId] = useState("");
  const [requestCode, setRequestCode] = useState("");
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);

  const handleStartProcess = (id) => {
    setId(id); 
  };

  const handleImagesLoaded = (loaded) => {
    setAllImagesLoaded(loaded);
  };
  console.log(allImagesLoaded);

  return (
    <>
      <AutomateProcess
        onStartProcess={handleStartProcess}
        allImagesLoaded={allImagesLoaded}
      />
      <div id="divToPrint">
        <Header id={id} requestCode={requestCode} />
        <CardContainer
          id={id}
          setRequestCode={setRequestCode}
          setAllImagesLoaded={handleImagesLoaded}
        />
      </div>
    </>
  );
}
