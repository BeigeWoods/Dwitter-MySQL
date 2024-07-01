import { Switch, Route, useHistory } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Header from "./components/Header";
import AllTweets from "./pages/AllTweets";
import MyTweets from "./pages/MyTweets";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";

function App({ tweetService, commentService }) {
  const history = useHistory();
  const { user, getUser, updateUser, changePassword, withdrawal, logout } =
    useAuth();

  const toAllTweets = () => {
    history.push("/");
  };
  const toProfile = () => {
    history.push("/my/profile");
  };
  const toChangePassword = () => {
    history.push("/my/change-password");
  };
  const toLogout = () => {
    if (window.confirm("Do you want to sign out?"))
      logout().then(() => history.push("/"));
  };
  const toWithdrawal = () => {
    if (window.confirm("Do you want to leave us?"))
      withdrawal().then(() => history.push("/"));
  };

  return (
    <div className="app">
      <Header
        username={user.username}
        toProfile={toProfile}
        toLogout={toLogout}
        toAllTweets={toAllTweets}
      />
      <Switch>
        (
        <>
          <Route exact path="/">
            <AllTweets
              tweetService={tweetService}
              commentService={commentService}
            />
          </Route>
          <Route exact path="/:username">
            <MyTweets
              tweetService={tweetService}
              commentService={commentService}
            />
          </Route>
          <Route exact path="/my/profile">
            <Profile
              onGetUser={getUser}
              onUpdateUser={updateUser}
              toChangePassword={toChangePassword}
              toWithdrawal={toWithdrawal}
            />
          </Route>
          <Route exact path="/my/change-password">
            <ChangePassword
              onChangePassword={changePassword}
              toProfile={toProfile}
            />
          </Route>
        </>
        )
      </Switch>
    </div>
  );
}

export default App;
