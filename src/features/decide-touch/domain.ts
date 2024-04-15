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
