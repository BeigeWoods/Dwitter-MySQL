import React, { useState } from "react";
import { useHistory } from "react-router";
import Banner from "../components/Banner";
import { UserForm, UserInput, Submit } from "../css/authForm";

const ChangePassword = ({ authService }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [text, setText] = useState("");
  const [isAlert, setIsAlert] = useState(false);
  const history = useHistory();

  const onSubmit = (event) => {
    event.preventDefault();
    authService
      .password(oldPassword, newPassword, checkPassword)
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
      case "oldPassword":
        return setOldPassword(value);
      case "newPassword":
        return setNewPassword(value);
      case "checkPassword":
        return setCheckPassword(value);
      default:
    }
  };

  return (
    <>
      <Banner text={text} isAlert={isAlert} />
      <UserForm onSubmit={onSubmit}>
        <UserInput
          name="oldPassword"
          type="password"
          placeholder="Old Password"
          defaultValue={oldPassword}
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
          placeholder="Check Password"
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
