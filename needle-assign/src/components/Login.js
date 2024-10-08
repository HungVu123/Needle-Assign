import React, { useState } from "react";
import { Button, Input, Typography } from "@material-tailwind/react";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ email, password });
  };

  return (
    <div className="form-container">
      <Typography variant="h4" className="mb-2">
        Login
      </Typography>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-96">
        <div className="form-group">
          <Input
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="youremail@address.com"
          />
        </div>
        <div className="form-group">
          <Input
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button color="blue" type="submit">
          Login
        </Button>
      </form>
    </div>
  );
};

export default Login;
