import { memo, useContext, useEffect, useReducer } from "react";
import {
  ClipDecision,
  Decision,
  DecisionSummary,
  TouchClip,
  percentLeft,
  percentNone,
  percentRight,
} from "../domain";
import useDecision from "../hooks/useMakeDecision";
import AuthContext from "../../users/hooks/createAuthContext";
import { getUserId } from "../../users/domain";

type CurrClip = "A" | "B";

type State = {
  loading: boolean;
  clipA: TouchClip | null;
  clipB: TouchClip | null;
  currClip: CurrClip;
  decisionSummary: DecisionSummary | null;
  clips: Generator<TouchClip> | null;
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
  loading: boolean,
  userId: string,
  clips: Generator<TouchClip> | null,
  getDecisions: (userId: string, clipId: string) => DecisionSummary,
  makeDecision: (decision: ClipDecision) => void,
): State {
  return {
    loading: loading,
    clipA: null,
    clipB: null,
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
  | { type: "make_decision"; decision: Decision }
  | { type: "fetched_clips"; clips: TouchClip[] };

function reducer(state: State, action: Action): State {
  if (action.type === "fetched_clips") {
    console.log(JSON.stringify(action.clips));
    const clips = fetchClipsGenerator(action.clips);
    return {
      ...state,
      clips,
      clipA: clips!.next().value,
      clipB: clips!.next().value,
      loading: false,
    };
  }
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
      ? setClipA(clips!.next().value, nextState)
      : setClipB(clips!.next().value, nextState);
  }

  if (action.type === "make_decision") {
    const { decision } = action;
    const clip = getCurrentClip(state);
    const { userId, getDecisions, makeDecision } = state;

    // Report this decision to the server
    const clipDecision: ClipDecision = {
      decision,
      clipId: clip!.clipId,
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

function* fetchClipsGenerator(clips: TouchClip[]): Generator<TouchClip> {
  var i = 0;
  while (true) {
    yield clips[i];
    i++;
    if (i >= clips.length) {
      i = 0;
    }
  }
}
/**
 *
 * To handle swapping in the next video without thrashing in resizing, and also to minimize lag when loading the video
 * we have two video tags running, with one hidden and the alternate being preloaded.
 */
const DecideTouch = () => {
  const authContext = useContext(AuthContext);
  const [getDecisions, makeDecision] = useDecision();

  const [{ loading, currClip, clipA, clipB, decisionSummary }, dispatch] =
    useReducer(
      reducer,
      initialState(
        true,
        getUserId(authContext),
        null,
        getDecisions,
        makeDecision,
      ),
    );

  useEffect(() => {
    const fetchData = async () => {
      const resp = await fetch("https://api.refbot.pro/clips");
      const data = await resp?.json();
      dispatch({
        type: "fetched_clips",
        clips: data.map((clipData: any) => ({
          clipId: clipData.id,
          clipUrl: clipData.url,
        })),
      });
    };
    fetchData();
  }, []);

  const handleDecisionClick = (decision: Decision) => {
    dispatch({ type: "make_decision", decision });
  };

  const handleNextClick = () => {
    dispatch({ type: "toggle_curr_clip" });
  };

  /**
   * Here is where we duplicate the components so we can preload the next video and also prevent resizing/flashing on the screen when going to the next one
   */
  return !loading ? (
    <>
      <DecideTouchImpl
        hidden={currClip !== "A"}
        clip={clipA!}
        handleDecisionClick={handleDecisionClick}
        decisionSummary={decisionSummary}
        handleNextClick={handleNextClick}
      />
      <DecideTouchImpl
        hidden={currClip !== "B"}
        clip={clipB!}
        handleDecisionClick={handleDecisionClick}
        decisionSummary={decisionSummary}
        handleNextClick={handleNextClick}
      />
    </>
  ) : (
    <></>
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

export default memo(DecideTouch);
