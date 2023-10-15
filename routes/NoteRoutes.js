const express = require("express");
const router = express.Router();
const noteModel = require("../models/NotesModel");

//TODO - Create a new Note
//http://mongoosejs.com/docs/api.html#document_Document-save
router.post("/notes", async (req, res) => {
  // Validate request
  if (!req.body.noteTitle || !req.body.noteDescription || !req.body.priority) {
    return res.status(400).send({
      message:
        "Note fields (noteTitle, noteDescription, priority) cannot be empty",
    });
  }

  try {
    const createNote = await noteModel.create({
      noteTitle: req.body.noteTitle,
      noteDescription: req.body.noteDescription,
      priority: req.body.priority,
    });

    return res.status(201).json(createNote);
  } catch (err) {
    return res.status(500).send({
      message: "Failed to create the note",
      error: err.message,
    });
  }
});

//TODO - Retrieve all Notes
//http://mongoosejs.com/docs/api.html#find_find
router.get("/notes", async (req, res) => {
  try {
    const notes = await noteModel.find();
    return res.status(200).json(notes);
  } catch (err) {
    return res.status(500).send({
      message: "Failed to retrieve notes",
      error: err.message,
    });
  }
});

//TODO - Retrieve a single Note with noteId
//http://mongoosejs.com/docs/api.html#findbyid_findById
router.get("/notes/:noteId", async (req, res) => {
  const noteId = req.params.noteId;

  try {
    const note = await noteModel.findById(noteId);
    if (!note) {
      return res.status(404).send({
        message: "Note not found",
      });
    }
    return res.status(200).json(note);
  } catch (err) {
    return res.status(500).send({
      message: "Failed to retrieve the note",
      error: err.message,
    });
  }
});

//TODO - Update a Note with noteId
//http://mongoosejs.com/docs/api.html#findbyidandupdate_findByIdAndUpdate
router.put("/notes/:noteId", async (req, res) => {
  const noteId = req.params.noteId;

  try {
    // Define the fields you want to update
    const updateFields = {};
    if (req.body.noteTitle) {
      updateFields.noteTitle = req.body.noteTitle;
    }
    if (req.body.noteDescription) {
      updateFields.noteDescription = req.body.noteDescription;
    }
    if (req.body.priority) {
      updateFields.priority = req.body.priority;
    }

    updateFields.dateUpdated = new Date();

    const updatedNote = await noteModel.findByIdAndUpdate(
      noteId,
      updateFields,
      { new: true }
    );
    if (!updatedNote) {
      return res.status(404).send({
        message: "Note not found",
      });
    }
    return res.status(200).json(updatedNote);
  } catch (err) {
    return res.status(500).send({
      message: "Failed to update the note",
      error: err.message,
    });
  }
});
//TODO - Delete a Note with noteId
//http://mongoosejs.com/docs/api.html#findbyidandremove_findByIdAndRemove
router.delete("/notes/:noteId", async (req, res) => {
  const noteId = req.params.noteId;

  try {
    const deletedNote = await noteModel.findByIdAndRemove(noteId);
    if (!deletedNote) {
      return res.status(404).send({
        message: "Note not found",
      });
    }
    return res.status(200).json({ message: "Note deleted successfully" });
  } catch (err) {
    return res.status(500).send({
      message: "Failed to delete the note",
      error: err.message,
    });
  }
});
module.exports = router;
