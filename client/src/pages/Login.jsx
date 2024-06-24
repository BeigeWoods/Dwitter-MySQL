import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { Cookies } from "react-cookie";
import Banner from "../components/Banner";
import { authForm } from "../css/forms";
import { login } from "../css/pages";

const Login = ({ onSignUp, onLogin, onGithubLogin }) => {
  const [signup, setSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [url, setURL] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const options = {
      sameSite: "none",
      secure: true,
    };
    const cookies = new Cookies();
    const message = cookies.get("oauth");
    message && onError(message).then(cookies.remove("oauth", options));
  }, []);

  const onSubmit = (event) => {
    event.preventDefault();
    if (signup) {
      onSignUp(username, password, name, email, url).catch(onError);
    } else {
      onLogin(username, password).catch(onError);
    }
  };

  const onError = async (err) => {
    setError(err.toString());
    setTimeout(() => {
      setError("");
    }, 3000);
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
      <Banner error={error} />
      <authForm.Form onSubmit={onSubmit}>
        <authForm.Input
          name="username"
          type="text"
          placeholder="Id"
          value={username}
          onChange={onChange}
          required
        />
        <authForm.Input
          name="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={onChange}
          required
        />
        {signup && (
          <authForm.Input
            name="name"
            type="text"
            placeholder="Name"
            value={name}
            onChange={onChange}
            required
          />
        )}
        {signup && (
          <authForm.Input
            name="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={onChange}
            required
          />
        )}
        {signup && (
          <authForm.Input
            name="url"
            type="url"
            placeholder="Profile Image URL"
            value={url}
            onChange={onChange}
          />
        )}
        <login.CheckSignup>
          <input
            name="signup"
            id="signup"
            type="checkbox"
            onChange={onChange}
            checked={signup}
          />
          <label htmlFor="signup"> Create a new account?</label>
        </login.CheckSignup>
        <authForm.Submit type="submit">
          {signup ? "Sign Up" : "Sign In"}
        </authForm.Submit>
      </authForm.Form>
      <login.GithubLogin>
        <login.GithubButton onClick={onGithubLogin}>
          <FontAwesomeIcon icon={faGithub} className="github-icon" />
          <span>Github Login</span>
        </login.GithubButton>
      </login.GithubLogin>
    </>
  );
};

export default Login;
