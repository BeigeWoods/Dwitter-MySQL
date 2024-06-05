import React, { useEffect, useState } from "react";
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

const Profile = ({
  onGetUser,
  onUpdateUser,
  toChangePassword,
  toWithdrawal,
}) => {
  const [profile, setProfile] = useState(undefined);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [url, setURL] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    onGetUser()
      .then((value) => setProfile(value))
      .catch(onError);
  }, [onGetUser]);

  const onSubmit = (event) => {
    event.preventDefault();
    if (
      username !== profile.username ||
      name !== profile.name ||
      email !== profile.email ||
      url !== profile.url
    )
      onUpdateUser(
        username === profile.username ? "" : username,
        name === profile.name ? "" : name,
        email === profile.email ? "" : email,
        url === profile.url ? "" : url
      )
        .then((update) => {
          if (update.username) {
            profile.username = update.username;
            setUsername("");
          }
          if (update.name) {
            profile.name = update.name;
            setName("");
          }
          if (update.email) {
            profile.email = update.email;
            setEmail("");
          }
          if (update.url) {
            profile.url = update.url;
            setURL("");
          }
          setProfile(profile);
        })
        .catch(onError);
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

  const onError = (error) => {
    setError(error.toString());
    setTimeout(() => {
      setError("");
    }, 3000);
  };

  return (
    <>
      <Banner text={error} />
      {profile && (
        <>
          <Avatar url={profile.url} name={profile.name} isTweet={false} />
          <UserForm onSubmit={onSubmit}>
            <Title>
              Username: <Span>{profile.username}</Span>
            </Title>
            <UserInput
              name="username"
              type="username"
              defaultValue={profile.username}
              onChange={onChange}
              required
            />
            {!profile.socialLogin && (
              <>
                <Title>
                  Name: <Span>{profile.name}</Span>
                </Title>
                <UserInput
                  name="name"
                  type="name"
                  defaultValue={profile.name}
                  onChange={onChange}
                  required
                />
                <Title>
                  Email: <Span>{profile.email}</Span>
                </Title>
                <UserInput
                  name="email"
                  type="email"
                  defaultValue={profile.email}
                  onChange={onChange}
                  required
                />
              </>
            )}
            <Title>
              Image Url:
              <Span>
                {profile.url.length > 50
                  ? `${profile.url.substring(0, 50)}...`
                  : profile.url}
              </Span>
            </Title>
            <UserInput
              name="url"
              type="url"
              defaultValue={profile.url}
              onChange={onChange}
            />
            <Submit type="submit">Submit</Submit>
          </UserForm>
          {!profile.socialLogin && (
            <Password onClick={toChangePassword}>Change Password →</Password>
          )}
        </>
      )}
      <Withdrawal onClick={toWithdrawal}>Withdrawal</Withdrawal>
    </>
  );
};

export default Profile;
