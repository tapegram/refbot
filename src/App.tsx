import { useState } from "react";
import "./App.css";
import AuthContext from "./features/users/hooks/createAuthContext";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignupPage from "./pages/Signup";

function App() {
  const [authContext] = useState({
    id: "test_user_id_1",
    email: "test@test.com",
  });

  return (
    <AuthContext.Provider value={authContext}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
