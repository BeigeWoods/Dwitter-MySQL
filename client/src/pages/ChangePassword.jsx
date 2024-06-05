import React, { useState } from "react";
import Banner from "../components/Banner";
import { UserForm, UserInput, Submit } from "../css/authForm";

const ChangePassword = ({ onChangePassword, toProfile }) => {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = (event) => {
    event.preventDefault();
    onChangePassword(password, newPassword, checkPassword)
      .then(toProfile())
      .catch(onError);
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

  const onError = (err) => {
    setError(err.toString());
    setTimeout(() => {
      setError("");
    }, 3000);
  };

  return (
    <>
      <Banner error={error} />
      <UserForm onSubmit={onSubmit}>
        <UserInput
          name="password"
          type="password"
          placeholder="Old Password"
          defaultValue={password}
          onChange={onChange}
          required
        />
        <UserInput
          name="newPassword"
          type="password"
          placeholder="New Password"
          defaultValue={newPassword}
          onChange={onChange}
          required
        />
        <UserInput
          name="checkPassword"
          type="password"
          placeholder="Check new Password"
          defaultValue={checkPassword}
          onChange={onChange}
          required
        />
        <Submit type="submit">Submit</Submit>
      </UserForm>
    </>
  );
};

export default ChangePassword;
