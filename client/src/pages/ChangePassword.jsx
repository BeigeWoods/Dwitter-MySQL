import React, { useState } from "react";
import { useHistory } from "react-router";
import Banner from "../components/Banner";
import { UserForm, UserInput, Submit } from "../css/authForm";

const ChangePassword = ({ authService }) => {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [text, setText] = useState("");
  const [isAlert, setIsAlert] = useState(false);
  const history = useHistory();

  const onSubmit = (event) => {
    event.preventDefault();
    authService
      .password(password, newPassword, checkPassword)
      .then(() => history.push("/auth/profile"))
      .catch(setError);
  };

  const setError = (error) => {
    setText(error.toString());
    setIsAlert(true);
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
    }
  };

  return (
    <>
      <Banner text={text} isAlert={isAlert} />
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
