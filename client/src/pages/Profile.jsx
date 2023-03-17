import React, { memo, useEffect, useState } from "react";
import { useHistory } from "react-router";
import styled from "styled-components";
import Avatar from "../components/Avatar";
import Banner from "../components/Banner";
import { UserForm, UserInput, Submit } from "../css/authForm";

const Title = styled.span`
  color: #485460;
`;

const Span = styled.span`
  color: black;
`;

const Password = styled.button`
  height: 25px;
  font-size: 15px;
  color: black;
  margin-top: 15px;
`;

const Withdrawal = styled.button`
  height: 25px;
  font-size: 15px;
  color: var(--color-red);
  margin-top: 13px;
`;

const Profile = memo(({ onWithdrawal, authService }) => {
  const [user, setUser] = useState(undefined);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [url, setURL] = useState("");
  const [socialLogin, setSocialLogin] = useState(false);
  const [text, setText] = useState("");
  const [isAlert, setIsAlert] = useState(false);
  const history = useHistory();

  useEffect(
    () =>
      authService
        .getUser()
        .then((user) => {
          setUser(user);
          setUsername(user.username);
          setName(user.name);
          setEmail(user.email);
          setURL(user.url);
          setSocialLogin(user.socialLogin);
        })
        .catch(setError),
    [authService]
  );

  const onSubmit = (event) => {
    event.preventDefault();
    authService
      .updateUser(username, name, email, url, socialLogin)
      .then((user) => setUser(user))
      .catch(setError);
  };

  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    switch (name) {
      case "username":
        return setUsername(value);
      case "name":
        return setName(value);
      case "email":
        return setEmail(value);
      case "url":
        return setURL(value);
      default:
    }
  };

  const setError = (error) => {
    setText(error.toString());
    setIsAlert(true);
  };

  const onChangePW = () => {
    history.push("/auth/change-password");
  };

  return (
    <>
      <Banner text={text} isAlert={isAlert} />
      <Avatar url={url} name={name} isTweet={false} />
      {user && (
        <>
          <UserForm onSubmit={onSubmit}>
            <Title>
              Username: <Span>{user.username}</Span>
            </Title>
            <UserInput
              name="username"
              type="username"
              defaultValue={username}
              onChange={onChange}
              required
            />
            <Title>
              Name: <Span>{user.name}</Span>
            </Title>
            {socialLogin ? (
              ""
            ) : (
              <UserInput
                name="name"
                type="name"
                defaultValue={name}
                onChange={onChange}
                required
              />
            )}
            <Title>
              Email: <Span>{user.email}</Span>
            </Title>
            {socialLogin ? (
              ""
            ) : (
              <UserInput
                name="email"
                type="email"
                defaultValue={email}
                onChange={onChange}
                required
              />
            )}
            <Title>
              Image Url:
              <Span>
                {user.url.length > 50
                  ? `${user.url.substring(0, 50)}...`
                  : user.url}
              </Span>
            </Title>
            <UserInput
              name="url"
              type="url"
              defaultValue={user.url}
              onChange={onChange}
            />
            <Submit type="submit">Submit</Submit>
          </UserForm>
          {socialLogin ? (
            ""
          ) : (
            <Password onClick={onChangePW}>Change Password →</Password>
          )}
        </>
      )}
      <Withdrawal onClick={onWithdrawal}>Withdrawal</Withdrawal>
    </>
  );
});

export default Profile;
