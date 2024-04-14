import { useState } from "react";
import { Decision, getRandomClipUrl } from "../domain";

const DecideTouch = () => {
  const [currentClip, setCurrentClip] = useState<string>(getRandomClipUrl());

  const handleDecisionClick = (decision: Decision) => {
    console.log(decision);
    setCurrentClip(getRandomClipUrl());
  };

  return (
    <div>
      <div className="videoContainer">
        <video key={currentClip} controls loop autoPlay muted>
          <source src={currentClip} type="video/mp4" />
        </video>
      </div>
      <div className="decisionContainer">
        <button onClick={() => handleDecisionClick("left")}>Left</button>
        <button onClick={() => handleDecisionClick("none")}>None</button>
        <button onClick={() => handleDecisionClick("right")}>Right</button>
      </div>
    </div>
  );
};

export default DecideTouch;
