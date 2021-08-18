import React, { useState } from "react";
import { Tab, Row as div, ListGroup } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { auth } from "./../utilities/firebase";
import { ThemeContext } from "../utilities/ThemeContext";

const AccountPage = ({ setUser, user }) => {
  const [loading, setLoading] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const history = useHistory();
  const { theme, toggleTheme } = React.useContext(ThemeContext);

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
              className="bi bi-chevron-left"
              onClick={() => history.push("/")}
            ></i>
            Your account
          </h1>
          <button onClick={toggleTheme} className="btn btn-success">
            <i
              className={`bi bi-${
                theme === "light" ? "sun-fill" : "moon-fill"
              }`}
            ></i>
          </button>
          <button
            onClick={() => history.push("/help")}
            className="btn btn-primary"
          >
            <i className="bi bi-info-circle"></i>
          </button>
          <button className="btn btn-danger" onClick={signOut}>
            Logout
          </button>
        </header>
        <Tab.Container defaultActiveKey="#account">
          <div id="settings">
            <div className="col-lg-4 col-md-4 col-sm-12">
              <ListGroup>
                <ListGroup.Item action href="#account">
                  Account
                </ListGroup.Item>
                <ListGroup.Item action href="#pref">
                  Prefrences
                </ListGroup.Item>
              </ListGroup>
            </div>
            <div className="col-lg-8 col-md-8 col-sm-12">
              <Tab.Content className="list-group-item rounded">
                <Tab.Pane eventKey="#account">
                  <h2>Reset password</h2>
                  <div className="container">
                    <input
                      className="border border-dark border-2 rounded"
                      type="text"
                      placeholder="your email"
                      value={verificationEmail}
                      onChange={(e) => setVerificationEmail(e.target.value)}
                    />
                    <button
                      className="btn btn-dark verfication-btn"
                      disabled={verificationEmail !== user.email}
                      onClick={() =>
                        auth
                          .sendPasswordResetEmail(user.email)
                          .then(() => signOut())
                          .catch((err) => console.error(err))
                      }
                      type="button"
                    >
                      Send Password reset email
                    </button>
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="#pref">
                  <h2>Theme</h2>
                  <div className="form-check form-check-inline form-switch">
                    <label
                      className="form-check-label float-start"
                      htmlFor="theme-switch"
                    >
                      Light
                    </label>
                    <input
                      checked={theme !== "light"}
                      onClick={toggleTheme}
                      id="theme-switch"
                      type="checkbox"
                      className="form-check-input ms-2 me-1"
                    />
                    <label className="form-check-label" htmlFor="theme-switch">
                      Dark
                    </label>
                  </div>
                </Tab.Pane>
              </Tab.Content>
            </div>
          </div>
        </Tab.Container>
      </>
    );
  }
};

export default AccountPage;
