import React, { useState } from "react";
import { auth } from "./../firebase";

export const User = null;

const Auth = ({ setUser }) => {
  const [form, setForm] = useState({
    email: "lloydtechno58@gmail.com",
    password: "hello123",
  });
  const [isRegistered, setRegistered] = useState(true);
  const [err, setErr] = useState("");

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
            setErr("Wrong email");
          } else {
            console.error(err);
            setErr("There was an error signing you in");
          }
        });
    } else {
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
    }
  }

  return (
    <form onSubmit={(e) => submitForm(e)}>
      <h1>
        {isRegistered ? "Login to your account" : "Signup for an account"}
      </h1>
      <h2>{err}</h2>
      <label htmlFor="email">Email</label>
      <input
        type="email"
        name="email"
        id="email"
        value={form.email}
        onChange={updateForm}
      />
      <label htmlFor="password">Enter a password</label>
      <input
        type="password"
        name="password"
        id="password"
        value={form.password}
        onChange={updateForm}
      />
      <button type="submit" onClick={(e) => submitForm(e)}>
        Submit
      </button>
      <button type="button" onClick={toggle}>
        {isRegistered ? "Signup instead" : "Sign in instead"}
      </button>
    </form>
  );
};

export default Auth;
