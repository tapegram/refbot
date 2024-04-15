export type Decision = "left" | "none" | "right";
export type ClipDecision = {
  decision: Decision;
  clipId: string;
  userId: string;
};
export type TouchClip = {
  clipId: string;
  clipUrl: string;
};
export type DecisionSummary = {
  left: number;
  none: number;
  right: number;
  yourDecisions: ClipDecision[];
};

export const percentLeft = (summary: DecisionSummary) => {
  const total = summary.left + summary.none + summary.right;
  return (total === 0 ? 0 : (summary.left / total) * 100).toFixed(2);
};

export const percentNone = (summary: DecisionSummary) => {
  const total = summary.left + summary.none + summary.right;
  return (total === 0 ? 0 : (summary.none / total) * 100).toFixed(2);
};

export const percentRight = (summary: DecisionSummary) => {
  const total = summary.left + summary.none + summary.right;
  return (total === 0 ? 0 : (summary.right / total) * 100).toFixed(2);
};

export const total = (summary: DecisionSummary) => {
  const total = summary.left + summary.none + summary.right;
  return total;
};
