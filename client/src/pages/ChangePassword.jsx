import React, { useState } from "react";
import Banner from "../components/Banner";
import { authForm } from "../css/forms";

const ChangePassword = ({ onChangePassword }) => {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = (event) => {
    event.preventDefault();
    onChangePassword(password, newPassword, checkPassword).catch(onError);
  };

  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    switch (name) {
      case "password":
        return setPassword(value);
      case "newPassword":
        return setNewPassword(value);
      case "checkPassword":
        return setCheckPassword(value);
      default:
        break;
    }
  };

  const onError = (error) => {
    setError(error.toString());
    setTimeout(() => {
      setError("");
    }, 3000);
  };

  return (
    <>
      <Banner error={error} />
      <authForm.Form onSubmit={onSubmit}>
        <authForm.Input
          name="password"
          type="password"
          placeholder="Old Password"
          defaultValue={password}
          onChange={onChange}
          required
        />
        <authForm.Input
          name="newPassword"
          type="password"
          placeholder="New Password"
          defaultValue={newPassword}
          onChange={onChange}
          required
        />
        <authForm.Input
          name="checkPassword"
          type="password"
          placeholder="Check new Password"
          defaultValue={checkPassword}
          onChange={onChange}
          required
        />
        <authForm.Submit type="submit">Submit</authForm.Submit>
      </authForm.Form>
    </>
  );
};

export default ChangePassword;
