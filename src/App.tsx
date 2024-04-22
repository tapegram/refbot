import { useState } from "react";
import "./App.css";
import AuthContext from "./features/users/hooks/createAuthContext";
import Home from "./pages/Home";
import { BrowserRouter as DataRouter, Routes, Route } from "react-router-dom";
import SignupPage from "./pages/Signup";
import LoginPage from "./pages/Login";
import { AuthStatus } from "./features/users/domain";

function App() {
  const [authStatus, setAuthStatus] = useState<AuthStatus>("anonymous");

  return (
    <AuthContext.Provider
      value={{ status: authStatus, setStatus: setAuthStatus }}
    >
      <DataRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </DataRouter>
    </AuthContext.Provider>
  );
}

export default App;
