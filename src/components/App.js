import React, { useEffect, useState } from "react";
import { Switch, useHistory, Route } from "react-router-dom";
import { auth } from "../firebase";
import Auth from "./Auth";
import Notes from "./Notes";

function App() {
  const history = useHistory();
  const [user, setUser] = useState({});
  const [userDetails, setDetails] = useState({});

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        history.push("/");
        setDetails(user);
      } else {
        history.push("/login");
      }
    });
  }, [user, history]);
  return (
    <>
      <Switch>
        <Route path="/login" children={<Auth setUser={setUser} />} />
        <Route
          path="/"
          children={<Notes setUser={setUser} user={userDetails} />}
        />
      </Switch>
    </>
  );
}

export default App;
