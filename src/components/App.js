import React, { useEffect, useState } from "react";
import { Switch, useHistory, Route } from "react-router-dom";
import { auth } from "../utilities/firebase";
import Auth from "./Auth";
import Notes from "./Notes";
import AccountPage from "./AccountPage";
import HelpPage from "./HelpPage";
import { ThemeContext } from "../utilities/ThemeContext";

function App() {
  const history = useHistory();
  const [user, setUser] = useState({});
  const [userDetails, setDetails] = useState({});

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setDetails(user);
        if (window.location.pathname === "/login") {
          history.push("/");
        }
      } else {
        history.push("/login");
      }
    });
  }, [user, history]);

  return (
    <div id={React.useContext(ThemeContext).theme}>
      <Switch>
        <Route path="/login" children={<Auth setUser={setUser} />} />
        <Route
          path="/account"
          children={<AccountPage user={user} setUser={setUser} />}
        />
        <Route path="/help" children={<HelpPage />} />
        <Route
          path="/"
          children={<Notes setUser={setUser} user={userDetails} />}
        />
      </Switch>
    </div>
  );
}

export default App;
