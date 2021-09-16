import React, { useState } from "react";
import { auth } from "../utilities/firebase";
import Illustration from "../media/Illustration1";
import firebase from "firebase/app";

export const User = null;

const Auth = ({ setUser }) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isRegistered, setRegistered] = useState(true);
  const [err, setErr] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  function toggle() {
    isRegistered ? setRegistered(false) : setRegistered(true);
  }

  function updateForm(e) {
    setForm((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  }

  function submitForm(e) {
    e.preventDefault();
    if (isRegistered) {
      auth
        .signInWithEmailAndPassword(form.email, form.password)
        .then((creds) => {
          setUser(creds.user);
        })
        .catch((err) => {
          if (err.code === "auth/user-not-found") {
            setErr(
              "User does not exist. Please check the credentials provided."
            );
          } else if (err.code === "auth/wrong-password") {
            setErr("Wrong password");
          } else if (err.code === "auth/invalid-email") {
            setErr("Invalid email");
          } else {
            console.error(err);
            setErr("There was an error signing you in");
          }
        });
    } else {
      if (form.password === form.confirmPassword) {
        auth
          .createUserWithEmailAndPassword(form.email, form.password)
          .then((creds) => {
            setUser(creds.user);
          })
          .catch((err) => {
            if (err.code === "auth/email-already-in-use") {
              setErr(
                "An account with this email address already exists. Please sign in instead."
              );
            } else if (err.code === "auth/weak-password") {
              setErr("Weak password");
            } else if (err.code === "auth/invalid-email") {
              setErr("Invalid email");
            } else {
              console.error(err);
              setErr("There was an error signing you up");
            }
          });
      } else {
        updateForm({ target: { name: "confirmPassword", value: "" } });
        setErr("Passwords dont match");
      }
    }
  }

  return (
    <>
      {err ? (
        <div id="err" className="alert alert-danger d-flex align-items-center">
          <i className="bi bi-exclamation-circle-fill" />
          {err}
        </div>
      ) : null}
      <div id="auth">
        <h1 className="col-12 text-center text-primary">Welcome to Notezzz</h1>
        <div className="illustration col-lg-6 col-md-6 col-sm-12">
          <Illustration />
        </div>
        <form
          className="col-lg-6 col-md-6 col-sm-12"
          onSubmit={(e) => submitForm(e)}
        >
          <h1>
            {isRegistered ? "Login to your account" : "Signup for an account"}
          </h1>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={updateForm}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Enter a password"
            value={form.password}
            onChange={updateForm}
            required
          />
          {isRegistered ? null : (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={form.confirmPassword}
              onChange={updateForm}
              required
            />
          )}
          <button
            type="submit"
            className="btn btn-secondary btn-lg"
            onClick={(e) => submitForm(e)}
          >
            {isRegistered ? "Login" : "Sign up"}
          </button>
          <button
            type="button"
            className="btn btn-outline-primary btn-lg"
            onClick={toggle}
          >
            {isRegistered ? "Signup instead" : "Log in instead"}
          </button>
          <div className="btn-group btn-group-lg">
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => {
                auth
                  .signInWithPopup(new firebase.auth.GoogleAuthProvider())
                  .then(() => null)
                  .catch((err) => setErr(err));
              }}
            >
              <i className="bi bi-google" />
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                auth
                  .signInWithPopup(new firebase.auth.FacebookAuthProvider())
                  .then((res) => setUser(res.user))
                  .catch((err) => setErr(err.message));
              }}
            >
              <i className="bi bi-facebook" />
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Auth;
