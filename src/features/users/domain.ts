export type AuthStatus = User | "anonymous";
export type User = {
  id: string;
};

export function getUserId(auth: AuthStatus): string {
  return auth === "anonymous" ? "anonymous" : auth.id;
}
