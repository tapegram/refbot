import { useContext, useReducer } from "react";
import {
  ClipDecision,
  Decision,
  DecisionSummary,
  TouchClip,
  percentLeft,
  percentNone,
  percentRight,
} from "../domain";
import usePaginatedClipsFetcher from "../hooks/usePaginatedClipsFetcher";
import useDecision from "../hooks/useMakeDecision";
import AuthContext from "../../users/hooks/createAuthContext";
import { getUserId } from "../../users/domain";

type CurrClip = "A" | "B";

type State = {
  clipA: TouchClip;
  clipB: TouchClip;
  currClip: CurrClip;
  decisionSummary: DecisionSummary | null;
  clips: Generator<TouchClip>;
  userId: string;
  getDecisions: (userId: string, clipId: string) => DecisionSummary;
  makeDecision: (decision: ClipDecision) => void;
};

function setClipA(clip: TouchClip, state: State) {
  return { ...state, clipA: clip };
}

function setClipB(clip: TouchClip, state: State) {
  return { ...state, clipB: clip };
}

function getCurrentClip({ currClip, clipA, clipB }: State) {
  return currClip == "A" ? clipA : clipB;
}

function initialState(
  userId: string,
  clips: Generator<TouchClip>,
  getDecisions: (userId: string, clipId: string) => DecisionSummary,
  makeDecision: (decision: ClipDecision) => void,
): State {
  return {
    clipA: clips.next().value,
    clipB: clips.next().value,
    currClip: "A",
    decisionSummary: null,
    clips,
    userId,
    getDecisions,
    makeDecision,
  };
}

type Action =
  | { type: "toggle_curr_clip" }
  | { type: "make_decision"; decision: Decision };

function reducer(state: State, action: Action): State {
  if (action.type === "toggle_curr_clip") {
    const { currClip, clips } = state;
    const nextClip = currClip == "A" ? "B" : "A";
    const prevClip = currClip;

    const nextState: State = {
      ...state,
      decisionSummary: null,
      currClip: nextClip,
    };

    return prevClip === "A"
      ? setClipA(clips.next().value, nextState)
      : setClipB(clips.next().value, nextState);
  }

  if (action.type === "make_decision") {
    const { decision } = action;
    const clip = getCurrentClip(state);
    const { userId, getDecisions, makeDecision } = state;

    // Report this decision to the server
    const clipDecision: ClipDecision = {
      decision,
      clipId: clip.clipId,
      userId,
    };

    makeDecision(clipDecision);

    const decisionSummary = getDecisions(
      clipDecision.userId,
      clipDecision.clipId,
    );

    return { ...state, decisionSummary };
  }

  throw new Error("Invalid Action");
}
/**
 *
 * To handle swapping in the next video without thrashing in resizing, and also to minimize lag when loading the video
 * we have two video tags running, with one hidden and the alternate being preloaded.
 */
const DecideTouch = () => {
  const authContext = useContext(AuthContext);
  const clips = usePaginatedClipsFetcher();
  const [getDecisions, makeDecision] = useDecision();

  const [{ currClip, clipA, clipB, decisionSummary }, dispatch] = useReducer(
    reducer,
    initialState(getUserId(authContext), clips, getDecisions, makeDecision),
  );

  const handleDecisionClick = (decision: Decision) => {
    dispatch({ type: "make_decision", decision });
  };

  const handleNextClick = () => {
    dispatch({ type: "toggle_curr_clip" });
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
        decisionSummary={decisionSummary}
        handleNextClick={handleNextClick}
      />
      <DecideTouchImpl
        hidden={currClip !== "B"}
        clip={clipB}
        handleDecisionClick={handleDecisionClick}
        decisionSummary={decisionSummary}
        handleNextClick={handleNextClick}
      />
    </>
  );
};

type DecideTouchImplProps = {
  hidden: boolean;
  clip: TouchClip;
  handleDecisionClick: (decision: Decision) => void;
  handleNextClick: () => void;
  decisionSummary: DecisionSummary | null;
};

const DecideTouchImpl = ({
  hidden,
  clip,
  handleDecisionClick,
  handleNextClick,
  decisionSummary,
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
    {decisionSummary ? (
      <>
        <div className="decisionContainer">
          <button disabled>Left - {percentLeft(decisionSummary)}%</button>
          <button disabled>None - {percentNone(decisionSummary)}%</button>
          <button disabled>Right - {percentRight(decisionSummary)}%</button>
        </div>
        <button className="nextButton" onClick={handleNextClick}>
          Next
        </button>
      </>
    ) : (
      <div className="decisionContainer">
        <button onClick={() => handleDecisionClick("left")}>Left</button>
        <button onClick={() => handleDecisionClick("none")}>None</button>
        <button onClick={() => handleDecisionClick("right")}>Right</button>
      </div>
    )}
  </div>
);

export default DecideTouch;
