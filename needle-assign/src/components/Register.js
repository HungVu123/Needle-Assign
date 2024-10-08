import { Button, Input, Typography } from "@material-tailwind/react";
import React, { useState } from "react";

const Register = ({ onRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister({ email, password });
  };

  return (
    <div className="form-container">
      <Typography variant="h4" className="mb-2">
        Register
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
          Register
        </Button>
      </form>
    </div>
  );
};

export default Register;
