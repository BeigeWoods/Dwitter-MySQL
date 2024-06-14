import {
  createContext,
  createRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import Header from "../components/Header";
import Login from "../pages/Login";

const AuthContext = createContext({});

const tokenRef = createRef();
const csrfRef = createRef();

export function AuthProvider({ authService, authErrorEventBus, children }) {
  const [user, setUser] = useState(undefined);
  const [csrfToken, setCsrfToken] = useState(undefined);

  useImperativeHandle(tokenRef, () => (user ? user.token : undefined));
  useImperativeHandle(csrfRef, () => csrfToken);

  useEffect(() => {
    authErrorEventBus.listen((err) => {
      console.error(err);
      setUser(undefined);
    });
  }, [authErrorEventBus]);

  useEffect(() => {
    authService.csrfToken().then(setCsrfToken).catch(console.error);
  }, [authService]);

  useEffect(() => {
    authService.me().then(setUser).catch(console.error);
  }, [authService]);

  const signUp = useCallback(
    (username, password, name, email, url) =>
      authService
        .signup(username, password, name, email, url)
        .then((user) => setUser(user)),
    [authService]
  );

  const logIn = useCallback(
    (username, password) =>
      authService.login(username, password).then((user) => setUser(user)),
    [authService]
  );

  const githubLogin = useCallback(
    () =>
      authService
        .githubLogin()
        .then((value) => window.location.assign(value))
        .catch(console.error),
    [authService]
  );

  const getUser = useCallback(() => authService.getUser(), [authService]);

  const updateUser = useCallback(
    (username, name, email, url) =>
      authService.updateUser(username, name, email, url).then((update) => {
        if (update.username) {
          user.username = update.username;
          setUser(user);
        }
        return update;
      }),
    [authService, user]
  );

  const changePassword = useCallback(
    (password, newPassword, checkPassword) =>
      authService.password(password, newPassword, checkPassword),
    [authService]
  );

  const logout = useCallback(
    () => authService.logout().then(() => setUser(undefined)),
    [authService]
  );

  const withdrawal = useCallback(
    () => authService.withdrawal().then(() => setUser(undefined)),
    [authService]
  );

  const context = useMemo(
    () => ({
      user,
      getUser,
      updateUser,
      changePassword,
      withdrawal,
      logout,
    }),
    [user, getUser, updateUser, changePassword, withdrawal, logout]
  );

  return (
    <AuthContext.Provider value={context}>
      {user ? (
        children
      ) : (
        <div className="app">
          <Header />
          <Login
            onSignUp={signUp}
            onLogin={logIn}
            onGithubLogin={githubLogin}
          />
        </div>
      )}
    </AuthContext.Provider>
  );
}

export class AuthErrorEventBus {
  listen(callback) {
    this.callback = callback;
  }
  notify(error) {
    this.callback(error);
  }
}

export default AuthContext;
export const fetchToken = () => tokenRef.current;
export const fetchCsrfToken = () => csrfRef.current;
export const useAuth = () => useContext(AuthContext);
