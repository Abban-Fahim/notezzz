import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { auth, db } from "./../utilities/firebase";
import icon from "./../media/create-icon.png";
import Draggable from "react-draggable";
import colorIcon from "./../media/color-picker-icon.jsx";
import { CirclePicker } from "react-color";
import Empty from "./../media/Empty";
import shadeColor from "../utilities/shade-color";
import NoteModal from "./Note-modal";
import { Modal } from "react-bootstrap";
import { ThemeContext } from "../utilities/ThemeContext";

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
  const [noteSelected, setNoteSelected] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modal, setModal] = useState({});

  const { theme, toggleTheme } = React.useContext(ThemeContext);

  useEffect(() => {
    if (user.uid !== undefined) {
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
    db.collection(user.uid)
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
    db.collection(user.uid)
      .add({
        title: newNote.title,
        body: newNote.body,
        color: color,
      })
      .then((doc) => {
        setLoading(false);
        setNewNote({
          title: "",
          body: "",
        });
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
    db.collection(user.uid)
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

  function openDeletingModal(noteId) {
    setModalVisible(true);
    setModal({
      title: "Confirm deletion",
      body: "Are you sure you want to delete this note, cuz it will be gone forever. A very, very long time!",
      footer: () => (
        <>
          <button
            className="btn btn-danger"
            onClick={() => {
              deleteNote(noteId);
              setModalVisible(false);
            }}
          >
            Delete
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setModalVisible(false)}
          >
            Cancel
          </button>
        </>
      ),
    });
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
        {isModalVisible ? (
          <Modal
            animation
            backdrop="static"
            show={true}
            onHide={() => setModalVisible(false)}
          >
            <Modal.Header>
              <Modal.Title>{modal.title}</Modal.Title>
              <button
                className="btn-close"
                onClick={() => setModalVisible(false)}
              ></button>
            </Modal.Header>
            <Modal.Body>{modal.body}</Modal.Body>
            <Modal.Footer>{<modal.footer />}</Modal.Footer>
          </Modal>
        ) : null}
        {noteSelected ? (
          <NoteModal
            noteToBeUpdated={noteSelected}
            setSelectedNote={setNoteSelected}
            user={user}
            setNotes={setNotes}
            notes={notes}
          />
        ) : null}
        <header>
          <h1>
            <i
              className="bi bi-person-circle"
              onClick={() => {
                history.push("/account");
              }}
            ></i>
            Your Notes
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
              <i className="bi bi-arrows-move"></i>
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
                    data-bs-toggle="modal"
                    data-bs-target="#modal"
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
                  className="col-md-4 col-lg-3 col-sm-6 col-12"
                  style={{ padding: "10px" }}
                >
                  <div
                    className="note"
                    style={{
                      backgroundColor:
                        theme === "light"
                          ? note.color
                          : shadeColor(note.color, -50),
                      border: `3px solid ${
                        theme === "light"
                          ? shadeColor(note.color, -40)
                          : note.color
                      }`,
                    }}
                    onDoubleClick={() => {
                      setNoteSelected(note);
                    }}
                  >
                    <p>{note.title}</p>
                    <p dangerouslySetInnerHTML={{ __html: note.body }} />
                    <div
                      className="note-btns"
                      style={{
                        color:
                          theme === "light"
                            ? shadeColor(note.color, -40)
                            : note.color,
                        backgroundColor:
                          theme === "light"
                            ? note.color
                            : shadeColor(note.color, -50),
                      }}
                    >
                      <button
                        className="btn"
                        onClick={() => openDeletingModal(note.id)}
                      >
                        <i className="bi bi-trash-fill"></i>
                      </button>
                      <button
                        className="btn"
                        onClick={() =>
                          window.open(
                            `/note/${user.uid}/${note.id}/`,
                            note.title,
                            "height=500,width=500"
                          )
                        }
                      >
                        <i class="bi bi-box-arrow-up-right"></i>
                      </button>
                      <button
                        className="btn"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `${window.location.origin}/note/${user.uid}/${note.id}/`
                          );
                        }}
                      >
                        <i class="bi bi-share-fill"></i>
                      </button>
                    </div>
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
