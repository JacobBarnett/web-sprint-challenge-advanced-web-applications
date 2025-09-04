import React, { useState } from "react";
import PT from "prop-types";

const initialFormValues = {
  username: "",
  password: "",
};
export default function LoginForm({ login }) {
  const [values, setValues] = useState(initialFormValues);
  // ✨ where are my props? Destructure them here

  const onChange = (evt) => {
    const { id, value } = evt.target;
    setValues({ ...values, [id]: value });
  };

  const onSubmit = (evt) => {
    evt.preventDefault();
    const username = values.username.trim();
    const password = values.password.trim();
    if (username.length >= 3 && password.length >= 8) {
      login({ username, password });
      setValues(initialFormValues);
    }
    // ✨ implement
  };

  const isDisabled = () => {
    const username = values.username.trim();
    const password = values.password.trim();
    return !(username.length >= 3 && password.length >= 8);
    // ✨ implement
    // Trimmed username must be >= 3, and
    // trimmed password must be >= 8 for
    // the button to become enabled
  };

  return (
    <form id="loginForm" onSubmit={onSubmit}>
      <h2>Login</h2>
      <input
        type="text"
        maxLength={20}
        value={values.username}
        onChange={onChange}
        placeholder="Enter username"
        id="username"
      />
      <input
        type="password"
        maxLength={20}
        value={values.password}
        onChange={onChange}
        placeholder="Enter password"
        id="password"
      />
      <button type="submit" disabled={isDisabled()} id="submitCredentials">
        Submit credentials
      </button>
    </form>
  );
}

// 🔥 No touchy: LoginForm expects the following props exactly:
LoginForm.propTypes = {
  login: PT.func.isRequired,
};
