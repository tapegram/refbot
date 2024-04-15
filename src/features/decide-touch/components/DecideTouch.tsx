import { useState } from "react";
import { ClipDecision, Decision, TouchClip } from "../domain";
import usePaginatedClipsFetcher from "../hooks/usePaginatedClipsFetcher";
import useDecision from "../hooks/useMakeDecision";

const DecideTouch = () => {
  const clips = usePaginatedClipsFetcher();
  const [currentClip, setCurrentClip] = useState<TouchClip>(clips.next().value);
  const [getDecisions, makeDecision] = useDecision();

  const handleDecisionClick = (decision: Decision) => {
    // Report this decision to the server
    const clipDecision: ClipDecision = {
      decision,
      clipId: currentClip.clipId,
    };
    makeDecision(clipDecision);

    // Print out the current summaries
    console.log(JSON.stringify(getDecisions(clipDecision.clipId)));

    // Load in the next clip
    const clip = clips.next().value;
    setCurrentClip(clip);
  };

  return (
    <div>
      <div className="videoContainer">
        <video
          key={currentClip.clipId}
          controls
          loop
          autoPlay
          muted
          webkit-playsinline
          playsInline
        >
          <source src={currentClip.clipUrl} type="video/mp4" />
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
