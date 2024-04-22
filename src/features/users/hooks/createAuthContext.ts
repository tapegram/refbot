import { Dispatch, SetStateAction, createContext } from "react";
import { AuthStatus } from "../domain";

const initialAuthContext: AuthState = {
  status: "anonymous",
  setStatus: () => {},
};
type AuthState = {
  status: AuthStatus;
  setStatus: Dispatch<SetStateAction<AuthStatus>>;
};
const AuthContext = createContext<AuthState>(initialAuthContext);

export default AuthContext;
