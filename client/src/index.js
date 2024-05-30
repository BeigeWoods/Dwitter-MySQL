import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./css/index.css";
import App from "./App.jsx";
import AuthService from "./service/auth.js";
import TweetService from "./service/tweet.js";
import CommentService from "./service/comment.js";
import {
  AuthProvider,
  fetchToken,
  fetchCsrfToken,
} from "./context/AuthContext.jsx";
import { AuthErrorEventBus } from "./context/AuthContext.jsx";
import HttpClient from "./network/http.js";
import Socket from "./network/socket.js";

const baseURL = process.env.REACT_APP_BASE_URL;
const authErrorEventBus = new AuthErrorEventBus();
const httpClient = new HttpClient(baseURL, authErrorEventBus, () =>
  fetchCsrfToken()
);
const authService = new AuthService(httpClient);
const socketClient = new Socket(baseURL, () => fetchToken());
const tweetService = new TweetService(httpClient, socketClient);
const commentService = new CommentService(httpClient, socketClient);

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider
        authService={authService}
        authErrorEventBus={authErrorEventBus}
      >
        <App
          tweetService={tweetService}
          authService={authService}
          commentService={commentService}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
