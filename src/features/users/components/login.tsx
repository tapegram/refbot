import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Inputs = {
  email: string;
  password: string;
};

const Login = () => {
  const [formErrors] = useState([]);
  const [inputs, setInputs] = useState<Inputs>({ email: "", password: "" });
  const navigate = useNavigate();

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputs),
    };
    const response = await fetch(
      "https://api.refbot.pro/auth/users/login",
      options,
    );
    if (response.ok) {
      navigate("/");
    } else {
      console.error("Failed to login");
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
          required
          onChange={onChange}
        />
      </div>
      <div className="submitGroup">
        <input type="submit" value="Login" disabled={formErrors.length > 0} />
      </div>
    </form>
  );
};

export default Login;
