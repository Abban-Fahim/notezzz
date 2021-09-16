import { error } from "jquery";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { db, auth } from "../utilities/firebase";

const NotePage = () => {
  const { userID, noteID } = useParams();
  const [note, setNote] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.collection(userID)
      .doc(noteID)
      .get()
      .then((doc) => {
        setNote({ id: doc.id, ...doc.data() });
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  const user = auth.currentUser;

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
        {!user ? (
          <header>
            <h1>Sign up to Notezzz</h1>
            <Link to={`/login`} className="btn btn-primary">
              Sign up
            </Link>
          </header>
        ) : null}
        <div
          className={`h-${!user ? 75 : 100} mx-auto note`}
          id="note-page"
          style={{ backgroundColor: note.color }}
        >
          <p className="text-center">{note.title}</p>
          <p dangerouslySetInnerHTML={{ __html: note.body }} />
        </div>
      </>
    );
  }
};

export default NotePage;
