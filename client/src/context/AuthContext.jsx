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
  // const [userInfo, setUserInfo] = useState(undefined);

  // 2. Ref에 다음 토큰 저장하기
  useImperativeHandle(tokenRef, () => (user ? user.token : undefined));
  useImperativeHandle(csrfRef, () => csrfToken);

  useEffect(() => {
    authErrorEventBus.listen((err) => {
      console.log(err);
      setUser(undefined);
    });
  }, [authErrorEventBus]);
  // 1. useEffect는 authService에서 토큰을 받아와서 modify 함수에 저장하기
  useEffect(() => {
    authService.csrfToken().then(setCsrfToken).catch(console.error);
  }, [authService]);

  useEffect(() => {
    authService.me().then(setUser).catch(console.error);
  }, [authService]);

  const signUp = useCallback(
    async (username, password, name, email, url) =>
      authService
        .signup(username, password, name, email, url)
        .then((user) => setUser(user)),
    [authService]
  );

  const logIn = useCallback(
    async (username, password) =>
      authService.login(username, password).then((user) => setUser(user)),
    [authService]
  );

  // const getUser = useCallback(
  //   async () => authService.getUser().then((user) => setUserInfo(user)),
  //   [authService]
  // );

  // const updateUser = useCallback(
  //   async (username, name, email, url) =>
  //     authService
  //       .updateUser(username, name, email, url)
  //       .then((user) => setUserInfo(user)),
  //   [authService]
  // );

  const logout = useCallback(
    async () => authService.logout().then(() => setUser(undefined)),
    [authService]
  );

  const withdrawal = useCallback(
    async () => authService.withdrawal().then(() => setUser(undefined)),
    [authService]
  );

  const context = useMemo(
    () => ({
      user,
      signUp,
      logIn,
      logout,
      withdrawal,
    }),
    [user, signUp, logIn, logout, withdrawal]
  );

  return (
    <AuthContext.Provider value={context}>
      {user ? (
        children
      ) : (
        <div className="app">
          <Header />
          <Login onSignUp={signUp} onLogin={logIn} />
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
