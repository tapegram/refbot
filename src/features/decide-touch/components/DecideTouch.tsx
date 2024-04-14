import { useState } from "react";
import { Decision } from "../domain";
import usePaginatedClipsFetcher from "../hooks/usePaginatedClipsFetcher";

const DecideTouch = () => {
  const clips = usePaginatedClipsFetcher();
  const [currentClip, setCurrentClip] = useState<string>(clips.next().value);

  const handleDecisionClick = (_decision: Decision) => {
    const clip = clips.next().value;
    setCurrentClip(clip);
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
