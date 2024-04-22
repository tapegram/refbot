import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../hooks/createAuthContext";

type Inputs = {
  email: string;
  password: string;
};

const SignUp = () => {
  const [formErrors] = useState([]);
  const [inputs, setInputs] = useState<Inputs>({ email: "", password: "" });
  const navigate = useNavigate();
  const { setStatus } = useContext(AuthContext);

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const options = {
      method: "POST",
      credentials: "include" as RequestCredentials,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputs),
    };
    const response = await fetch(
      "https://api.refbot.pro/auth/users/signup",
      options,
    );
    if (response.ok) {
      const user = await response.json();
      setStatus({
        id: user.id,
      });
      navigate("/");
    } else {
      console.error("Failed to sign up");
    }
  }
  return (
    <form className="simple-form" onSubmit={submit}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          onChange={onChange}
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          autoComplete="current-password"
          required
          onChange={onChange}
        />
      </div>
      <div className="submitGroup">
        <input type="submit" value="Sign Up" disabled={formErrors.length > 0} />
      </div>
      <div className="loginSignupSwitch">
        <Link to="/login">or login</Link>
      </div>
    </form>
  );
};

export default SignUp;
