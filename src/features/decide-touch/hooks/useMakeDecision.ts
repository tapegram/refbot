import { ClipDecision, DecisionSummary } from "../domain";

const IN_MEMORY_DECISIONS = new Map<string, ClipDecision[]>();

/**
 * A hook for reporting decisions on a clip to the backend, and getting a summary of decisions for a clip
 */
function useDecision(): [
  (userId: string, clipId: string) => DecisionSummary,
  (clipDecision: ClipDecision) => void,
] {
  const makeDecision = (clipDecision: ClipDecision) => {
    const decisions = IN_MEMORY_DECISIONS.get(clipDecision.clipId) || [];
    decisions.push(clipDecision);
    IN_MEMORY_DECISIONS.set(clipDecision.clipId, decisions);
  };
  const getDecisions = (userId: string, clipId: string): DecisionSummary => {
    const decisions = IN_MEMORY_DECISIONS.get(clipId) || [];
    return {
      left: decisions.filter((d) => d.decision === "left").length,
      none: decisions.filter((d) => d.decision === "none").length,
      right: decisions.filter((d) => d.decision === "right").length,
      yourDecisions: decisions.filter((d) => d.userId === userId),
    };
  };

  return [getDecisions, makeDecision];
}

export default useDecision;
