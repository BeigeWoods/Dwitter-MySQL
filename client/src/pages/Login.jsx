import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { baseURL } from "..";
import Banner from "../components/Banner";
import { UserForm, UserInput, Submit } from "../css/authForm";
import styled from "styled-components";

const GithubLogin = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px 80px;
  padding: 5px;
  background-color: var(--color-black);
  border-radius: 20px;
  text-decoration-line: none;
`;

const GithubButton = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  grid-column-gap: 10px;
  color: var(--color-white);
  font-size: 1.2rem;
  font-weight: bold;
`;

const CheckSignup = styled.div`
  margin-top: 8px;
`;

const Login = ({ onSignUp, onLogin }) => {
  const [signup, setSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [url, setURL] = useState("");
  const [text, setText] = useState("");
  const [isAlert, setIsAlert] = useState(false);

  const onSubmit = (event) => {
    event.preventDefault();
    if (signup) {
      onSignUp(username, password, name, email, url).catch(setError);
    } else {
      onLogin(username, password).catch(setError);
    }
  };

  const setError = (error) => {
    setText(error.toString());
    setIsAlert(true);
  };

  const onChange = (event) => {
    const {
      target: { name, value, checked },
    } = event;
    switch (name) {
      case "username":
        return setUsername(value);
      case "password":
        return setPassword(value);
      case "name":
        return setName(value);
      case "email":
        return setEmail(value);
      case "url":
        return setURL(value);
      case "signup":
        return setSignup(checked);
      default:
    }
  };

  return (
    <>
      <Banner text={text} isAlert={isAlert} />
      <UserForm onSubmit={onSubmit}>
        <UserInput
          name="username"
          type="text"
          placeholder="Id"
          value={username}
          onChange={onChange}
          required
        />
        <UserInput
          name="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={onChange}
          required
        />
        {signup && (
          <UserInput
            name="name"
            type="text"
            placeholder="Name"
            value={name}
            onChange={onChange}
            required
          />
        )}
        {signup && (
          <UserInput
            name="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={onChange}
            required
          />
        )}
        {signup && (
          <UserInput
            name="url"
            type="url"
            placeholder="Profile Image URL"
            value={url}
            onChange={onChange}
          />
        )}
        <CheckSignup>
          <input
            name="signup"
            id="signup"
            type="checkbox"
            onChange={onChange}
            checked={signup}
          />
          <label htmlFor="signup"> Create a new account?</label>
        </CheckSignup>
        <Submit type="submit">{signup ? "Sign Up" : "Sign In"}</Submit>
      </UserForm>
      <GithubLogin href={`${baseURL}/auth/github/start`}>
        <GithubButton>
          <FontAwesomeIcon icon={faGithub} className="github-icon" />
          <span>Github Login</span>
        </GithubButton>
      </GithubLogin>
    </>
  );
};

export default Login;
