import { useContext, useState } from "react";
import { ClipDecision, Decision, TouchClip } from "../domain";
import usePaginatedClipsFetcher from "../hooks/usePaginatedClipsFetcher";
import useDecision from "../hooks/useMakeDecision";
import AuthContext from "../../users/hooks/createAuthContext";
import { getUserId } from "../../users/domain";

type CurrClip = "A" | "B";
/**
 *
 * To handle swapping in the next video without thrashing in resizing, and also to minimize lag when loading the video
 * we have two video tags running, with one hidden and the alternate being preloaded.
 */
const DecideTouch = () => {
  const clips = usePaginatedClipsFetcher();
  const [clipA, setClipA] = useState<TouchClip>(clips.next().value);
  const [clipB, setClipB] = useState<TouchClip>(clips.next().value);
  const [currClip, setCurrClip] = useState<CurrClip>("A");
  const [getDecisions, makeDecision] = useDecision();
  const authContext = useContext(AuthContext);

  const getCurrentClip = () => (currClip == "A" ? clipA : clipB);

  const toggleCurrClip = () => {
    const nextClip = currClip == "A" ? "B" : "A";
    const prevClip = currClip;

    setCurrClip(nextClip);

    if (prevClip === "A") {
      setClipA(clips.next().value);
    } else {
      setClipB(clips.next().value);
    }
  };

  const handleDecisionClick = (decision: Decision) => {
    const clip = getCurrentClip();

    // Report this decision to the server
    const clipDecision: ClipDecision = {
      decision,
      clipId: clip.clipId,
      userId: getUserId(authContext),
    };

    makeDecision(clipDecision);

    // Print out the current summaries
    console.log(JSON.stringify(getDecisions(clipDecision.clipId)));

    // Switch to the other clip and preload the next one
    toggleCurrClip();
  };

  /**
   * Here is where we duplicate the components so we can preload the next video and also prevent resizing/flashing on the screen when going to the next one
   */
  return (
    <>
      <DecideTouchImpl
        hidden={currClip !== "A"}
        clip={clipA}
        handleDecisionClick={handleDecisionClick}
      />
      <DecideTouchImpl
        hidden={currClip !== "B"}
        clip={clipB}
        handleDecisionClick={handleDecisionClick}
      />
    </>
  );
};

type DecideTouchImplProps = {
  hidden: boolean;
  clip: TouchClip;
  handleDecisionClick: (decision: Decision) => void;
};

const DecideTouchImpl = ({
  hidden,
  clip,
  handleDecisionClick,
}: DecideTouchImplProps) => (
  <div hidden={hidden}>
    <div className="videoContainer">
      <video
        key={clip.clipId}
        controls
        loop
        autoPlay
        muted
        webkit-playsinline="true"
        playsInline
      >
        <source src={clip.clipUrl} type="video/mp4" />
      </video>
    </div>
    <div className="decisionContainer">
      <button onClick={() => handleDecisionClick("left")}>Left</button>
      <button onClick={() => handleDecisionClick("none")}>None</button>
      <button onClick={() => handleDecisionClick("right")}>Right</button>
    </div>
  </div>
);

export default DecideTouch;
