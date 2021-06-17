import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { auth, db } from "../firebase";

const Notes = ({ setUser, user }) => {
  console.log(user.hasOwnProperty("email"));
  const [newNote, setNewNote] = useState({
    id: "",
    title: "",
    body: "",
  });
  const [notes, setNotes] = useState([]);
  const history = useHistory();

  useEffect(() => {
    console.log(user.email);
    if (user.email !== undefined) {
      db.collection(user.email)
        .get()
        .then((docs) => {
          if (docs.empty) {
            setNotes([{ title: "You dont have notes, create one" }]);
          } else {
            docs.docs.map((note) => {
              setNotes((prev) => {
                return [...prev, note.data()];
              });
              //   console.log(note.data());
            });
          }
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      console.log("No user!");
      history.push("/login");
    }
  }, [user]);

  function updateValue(e) {
    e.preventDefault();
    setNewNote((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  }

  function createNote() {
    db.collection(user.email)
      .add({
        title: newNote.title,
        body: newNote.body,
      })
      .then((doc) => {
        setNotes((prev) => {
          return [...prev, { id: doc.id, ...newNote }];
        });
      })
      .catch((doc) => {
        console.error(doc);
      });
  }

  function deleteNote() {}

  function updateNotes() {}

  return (
    <div className="notes">
      <p>{user.email}'s Notes</p>
      <button
        onClick={() => {
          auth
            .signOut()
            .then(setUser(false))
            .catch((err) => console.error(err));
        }}
      >
        Logout
      </button>
      <div className="create-form">
        <input
          type="text"
          name="title"
          value={newNote.title}
          placeholder="Note title"
          onChange={updateValue}
        />
        <input
          type="text"
          name="body"
          value={newNote.body}
          placeholder="Note body"
          onChange={updateValue}
        />
        <button onClick={createNote}>Create note</button>
      </div>
      <div className="notes">
        {notes.map((note, num) => {
          console.log(note.id);
          return (
            <div key={num} style={{ borderBottom: "blue 2px solid" }}>
              <p>{note.title}</p>
              <p>{note.body}</p>
              <button
                onClick={() => {
                  db.collection(user.email)
                    .doc(note.id)
                    .delete()
                    .then(() => console.log("lmao"))
                    .catch((err) => console.error(err));
                }}
              >
                hello
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Notes;
