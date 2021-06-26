import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { auth, db } from "../firebase";
import icon from "./../styles/create-icon.png";
import Draggable from "react-draggable";
import colorIcon from "./../styles/color-picker-icon.jsx";
import { CirclePicker } from "react-color";
import Empty from "./Empty";
import shadeColor from "../utilities/shade-color";

const Notes = ({ setUser, user }) => {
  const [notes, setNotes] = useState([]);
  const [colorSelection, setSelection] = useState(false);
  const history = useHistory();
  const [color, setColor] = useState("#fc157e");
  const [newNote, setNewNote] = useState({
    title: "",
    body: "",
  });
  const [loading, setLoading] = useState(true);
  const [formCollapsed, setCollapsed] = useState(false);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (user.email !== undefined) {
      getNotes();
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

  function getNotes() {
    setLoading(true);
    db.collection(user.email)
      .get()
      .then((docs) => {
        if (docs.empty) {
          setNotes([]);
          setLoading(false);
        } else {
          setLoading(false);
          docs.docs.map((note) => {
            setNotes((prev) => {
              let receivedNotes = { id: note.id, ...note.data() };
              if (receivedNotes !== prev) {
                return [...prev, receivedNotes];
              } else {
                return [...prev];
              }
            });
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function createNote() {
    setLoading(true);
    db.collection(user.email)
      .add({
        title: newNote.title,
        body: newNote.body,
        color: color,
      })
      .then((doc) => {
        setLoading(false);
        setNotes((prev) => {
          let bruh = [...prev, { id: doc.id, ...newNote, color: color }];
          return bruh;
        });
      })
      .catch((doc) => {
        console.error(doc);
      });
  }

  function deleteNote(noteToDelete) {
    setLoading(true);
    db.collection(user.email)
      .doc(noteToDelete)
      .delete()
      .then(() => {
        setNotes((prev) => {
          return prev.filter((note) => note.id !== noteToDelete);
        });
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }

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

  function updateNotes() {}

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
            Your Notes
          </h1>
          <button className="btn btn-danger" onClick={signOut}>
            Logout
          </button>
        </header>
        <Draggable
          onDrag={() => {
            setDragging(true);
          }}
          onStop={() => setDragging(false)}
          bounds="parent"
          cancel="input, button, img, textarea, span"
        >
          <div className={dragging ? "create-form shadow" : "create-form"}>
            <div className="controls">
              <i class="bi bi-arrows-move"></i>
              <button
                className="btn btn-dark"
                onClick={() =>
                  formCollapsed ? setCollapsed(false) : setCollapsed(true)
                }
              >
                <i
                  className={formCollapsed ? "bi bi-subtract" : "bi bi-dash-lg"}
                ></i>
              </button>
            </div>
            {formCollapsed ? null : (
              <>
                <input
                  type="text"
                  name="title"
                  value={newNote.title}
                  placeholder="Note title"
                  onChange={updateValue}
                />
                <textarea
                  name="body"
                  value={newNote.body}
                  placeholder="Note body"
                  onChange={updateValue}
                />
                <div>
                  <button
                    onClick={createNote}
                    className="btn btn-primary create-btn"
                  >
                    <img src={icon} alt="create" />
                  </button>
                  <button
                    onClick={() =>
                      colorSelection ? setSelection(false) : setSelection(true)
                    }
                    className="btn color-btn"
                  >
                    {colorIcon}
                  </button>
                </div>
                {colorSelection ? (
                  <CirclePicker
                    width="110%"
                    circleSpacing={10}
                    color={color}
                    colors={[
                      "#FC157E",
                      "#E0D331",
                      "#6AC13A",
                      "#22C5FC",
                      "#A500F7",
                    ]}
                    onChange={(color) => {
                      setColor(() => {
                        return color.hex;
                      });
                    }}
                  />
                ) : null}
              </>
            )}
          </div>
        </Draggable>

        {notes.length < 1 ? (
          <div
            className="notes"
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <div>
              <Empty />
            </div>
          </div>
        ) : (
          <div className="notes">
            {notes.map((note, num) => {
              return (
                <div
                  key={num}
                  className="col-md-4 col-lg-3 col-sm-6"
                  style={{ padding: "10px" }}
                >
                  <div
                    className="note"
                    style={{
                      backgroundColor: note.color,
                      border: `3px solid ${shadeColor(note.color, -40)}`,
                    }}
                  >
                    <p>{note.title}</p>
                    <p>{note.body}</p>
                    <button
                      className="delete btn"
                      style={{
                        color: shadeColor(note.color, -40),
                      }}
                      onClick={() => deleteNote(note.id)}
                    >
                      <i className="bi bi-trash-fill"></i>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </>
    );
  }
};

export default Notes;
