import React from "react";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import colorIcon from "../media/color-picker-icon.jsx";
import { CirclePicker } from "react-color";
import { db } from "./../utilities/firebase";

function NoteModal({
  noteToBeUpdated,
  setSelectedNote,
  user,
  setNotes,
  notes,
}) {
  const [note, setNote] = useState(noteToBeUpdated);
  const [colorSelection, setSelection] = useState(false);

  function updateNote(e) {
    e.preventDefault();
    setNote((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  }

  function confirmUpdate() {
    db.collection(user.uid)
      .doc(note.id)
      .update({ ...note })
      .then(() => {
        let notesToBeInserted = notes;
        for (var i = 0; i < notes.length; i++) {
          if (notesToBeInserted[i].id == note.id) {
            notesToBeInserted[i] = { ...note };
          }
          setNotes(notesToBeInserted);
        }
        setSelectedNote(false);
      })
      .catch((err) => console.error(err));
  }

  return (
    <Modal
      animation
      size="lg"
      backdrop="static"
      show={true}
      onHide={() => setSelectedNote(false)}
    >
      <Modal.Header className="border border-dark border-2 bg-primary">
        <input
          className="h1 modal-title bg-primary"
          value={note.title}
          onChange={updateNote}
          name="title"
        />
        <button
          className="btn-close"
          onClick={() => setSelectedNote(false)}
        ></button>
      </Modal.Header>

      <Modal.Body className="bg-dark">
        <textarea
          className="bg-dark text-white edit-body"
          name="body"
          onChange={updateNote}
          value={note.body}
        ></textarea>
      </Modal.Body>

      <Modal.Footer className="bg-dark border border-dark border-2">
        <div>
          <button onClick={confirmUpdate} className="btn btn-primary">
            <i className="bi bi-check-lg"></i>
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
            color={note.color}
            colors={["#FC157E", "#E0D331", "#6AC13A", "#22C5FC", "#A500F7"]}
            onChange={(color) => {
              updateNote({
                preventDefault: () => null,
                target: {
                  name: "color",
                  value: color.hex,
                },
              });
            }}
          />
        ) : null}
      </Modal.Footer>
    </Modal>
  );
}

export default NoteModal;
