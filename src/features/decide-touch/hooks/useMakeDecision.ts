import { ClipDecision, Decision } from "../domain";

const IN_MEMORY_DECISIONS = new Map<string, Decision[]>();

/**
 * A hook for reporting decisions on a clip to the backend, and getting a summary of decisions for a clip
 */
function useDecision(): [
  (clipId: string) => DecisionSummary,
  (clipDecision: ClipDecision) => void,
] {
  const makeDecision = (clipDecision: ClipDecision) => {
    const decisions = IN_MEMORY_DECISIONS.get(clipDecision.clipId) || [];
    decisions.push(clipDecision.decision);
    IN_MEMORY_DECISIONS.set(clipDecision.clipId, decisions);
  };
  const getDecisions = (clipId: string): DecisionSummary => {
    const decisions = IN_MEMORY_DECISIONS.get(clipId) || [];
    return {
      left: decisions.filter((d) => d === "left").length,
      none: decisions.filter((d) => d === "none").length,
      right: decisions.filter((d) => d === "right").length,
    };
  };

  return [getDecisions, makeDecision];
}

export type DecisionSummary = {
  left: number;
  none: number;
  right: number;
};

export default useDecision;
