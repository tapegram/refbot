import { createContext } from "react";
import { AuthStatus } from "../domain";

const initialAuthContext: AuthStatus = "anonymous";
const AuthContext = createContext<AuthStatus>(initialAuthContext);

export default AuthContext;
