import { Switch, Route, useHistory } from "react-router-dom";
import Header from "./components/Header";
import AllTweets from "./pages/AllTweets";
import MyTweets from "./pages/MyTweets";
import { useAuth } from "./context/AuthContext";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";

function App({ tweetService, authService, commentService }) {
  const history = useHistory();
  const { user, logout, withdrawal } = useAuth();

  const onAllTweets = () => {
    history.push("/");
  };

  const onMyTweets = () => {
    history.push(`/${user.username}`);
  };

  const onLogout = () => {
    if (window.confirm("Do you want to log out?")) {
      logout().then(() => history.push("/"));
    }
  };

  const onWithdrawal = () => {
    if (window.confirm("Do you want to leave us?")) {
      withdrawal().then(() => history.push("/"));
    }
  };

  return (
    <div className="app">
      <Header
        username={user.username}
        onLogout={onLogout}
        onAllTweets={onAllTweets}
        onMyTweets={onMyTweets}
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
          <Route exact path="/auth/profile">
            <Profile onWithdrawal={onWithdrawal} authService={authService} />
          </Route>
          <Route exact path="/auth/change-password">
            <ChangePassword authService={authService} />
          </Route>
        </>
        )
      </Switch>
    </div>
  );
}

export default App;
