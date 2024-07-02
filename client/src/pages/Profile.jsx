import React, { useEffect, useState } from "react";
import Avatar from "../components/Avatar";
import Banner from "../components/Banner";
import { authForm } from "../css/forms";
import { profile } from "../css/pages";

const Profile = ({
  onGetUser,
  onUpdateUser,
  toChangePassword,
  toWithdrawal,
}) => {
  const [user, setUser] = useState(undefined);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [url, setURL] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    onGetUser()
      .then((value) => setUser(value))
      .catch(onError);
  }, [onGetUser]);

  const onSubmit = (event) => {
    event.preventDefault();
    if (username || name || email || url)
      onUpdateUser(username, name, email, url)
        .then((update) => {
          if (update.username) {
            user.username = update.username;
            setUsername("");
          }
          if (update.name) {
            user.name = update.name;
            setName("");
          }
          if (update.email) {
            user.email = update.email;
            setEmail("");
          }
          if (update.url) {
            user.url = update.url;
            setURL("");
          }
          setUser(user);
        })
        .catch(onError);
  };

  const onChange = (event) => {
    const {
      target: { index, value },
    } = event;
    switch (index) {
      case "username":
        return setUsername(value !== user.username ? value : "");
      case "name":
        return setName(value !== user.name ? value : "");
      case "email":
        return setEmail(value !== user.email ? value : "");
      case "url":
        return setURL(value !== user.url ? value : "");
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
      {user && (
        <>
          <Avatar url={user.url} name={user.name} isTweet={false} />
          <authForm.Form onSubmit={onSubmit}>
            <profile.Title>
              Username: <profile.Span>{user.username}</profile.Span>
            </profile.Title>
            <authForm.Input
              index="username"
              type="username"
              onChange={onChange}
            />
            {!user.socialLogin && (
              <>
                <profile.Title>
                  Name: <profile.Span>{user.name}</profile.Span>
                </profile.Title>
                <authForm.Input index="name" type="name" onChange={onChange} />
                <profile.Title>
                  Email: <profile.Span>{user.email}</profile.Span>
                </profile.Title>
                <authForm.Input
                  index="email"
                  type="email"
                  onChange={onChange}
                />
              </>
            )}
            <profile.Title>
              Image Url:
              <profile.Span>
                {user.url.length > 50
                  ? `${user.url.substring(0, 50)}...`
                  : user.url}
              </profile.Span>
            </profile.Title>
            <authForm.Input index="url" type="url" onChange={onChange} />
            <authForm.Submit type="submit">Submit</authForm.Submit>
          </authForm.Form>
          {!user.socialLogin && (
            <profile.Password onClick={toChangePassword}>
              Change Password →
            </profile.Password>
          )}
        </>
      )}
      <profile.Withdrawal onClick={toWithdrawal}>Withdrawal</profile.Withdrawal>
    </>
  );
};

export default Profile;
