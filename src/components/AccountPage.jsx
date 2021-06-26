import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { auth } from "../firebase";

const AccountPage = ({ setUser }) => {
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  function signOut() {
    setLoading(true);
    auth
      .signOut()
      .then(() => {
        setUser(false);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vw-100 vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  } else {
    return (
      <>
        <header>
          <h1>
            <i
              class="bi bi-person-circle"
              onClick={() => {
                history.push("/account");
              }}
            ></i>
            Your account
          </h1>
          <button className="btn btn-danger" onClick={signOut}>
            Logout
          </button>
        </header>
      </>
    );
  }
};

export default AccountPage;
