const Notes = require("../models/Notes");
const User = require("../models/User");
const { errorResponse } = require("../middleware/middleware");
const bcrypt = require("bcryptjs");
const  mailer = require("../utils/mailer");


const createNotes = async (req, res) => {
  let newNote;
  try {
    const { userId, title, content, category, createdAt, updatedAt, isPinned, isArchived, isPersonal } = req.body;
    if (category == "thought") {
      const count = await Notes.countDocuments({ category: "thought", userId: userId });
      if (count >= 1) {
        return res.status(400).json({
          status: "FAILURE",
          message: "Only one thought per day!!!----Please try again tomorrow----"
        })
      }
    }
    else if (category == "personal") {
      var password = req.body.password;
      if (!password) {
        return res.status(400).json({
          status: "FAILURE",
          message: "X!X! Password required to access personal notes X!X!"
        })
      }
      else {
        var hashedPassword = await bcrypt.hash(password, 10)
        newNote = new Notes({ userId, password: hashedPassword, title, content, category, createdAt, updatedAt, isPinned, isArchived, isPersonal });
      }
    }
    else {
      newNote = new Notes({ userId, title, content, category, createdAt, updatedAt, isPinned, isArchived, isPersonal });

    }
    await newNote.save();
    res.status(200).json({
      status: "SUCCESS",
      message: "New Task Created",
      Notes: newNote
    })
  }
  catch (e) {
    res.status(500).json(errorResponse("createNotes", e));
  }
};

const getAllNotes = async (req, res) => {
  try {
    const notesId = req?.params?.taskId || "";
    const category = req?.params?.category || "";

    let getAllNotes;

    switch (true) {
      case !!notesId:
        getAllNotes = await Notes.find({ notesId });
        break;
      case !!category:
        if (category === "personal") {
          return res.status(400).json({
            status: "FAILURE",
            message: "Access to personal notes is restricted. Please use the secure route.",
          });
        }
        getAllNotes = await Notes.find({ category });
        break;
      default:
        getAllNotes = await Notes.find({ category: { $ne: "personal" } });
        break;
    }

    if (getAllNotes.length > 0) {
      res.status(200).json({
        status: "SUCCESS",
        message: "Notes Fetched successfully",
        notes: getAllNotes,
      });
    } else {
      res.status(200).json({
        status: "FAILURE",
        message: "No Notes Found!!!",
      });
    }
  } catch (e) {
    res.status(500).json(errorResponse("getAllNotes", e));
  }
};

const getPersonalNotes = async (req, res) => {
  const { userId, password } = req.body;

  try {
    const personalNotes = await Notes.find({ category: "personal", userId });
    const user = await User.findOne({ userId });

    if (!personalNotes.length) {
      return res.status(404).json({
        status: "FAILURE",
        message: "No personal notes found for this user.",
      });
    }

    if (!password) {
      return res.status(400).json({
        status: "FAILURE",
        message: "Password is required to access Personal Notes!!!"
      });
    }

    // Find a note that actually has the password field set
    const noteWithPassword = personalNotes.find(note => note.password);

    if (!noteWithPassword) {
      return res.status(400).json({
        status: "FAILURE",
        message: "No password set for personal notes. Please contact support."
      });
    }

    const isMatch = await bcrypt.compare(password, noteWithPassword.password);

    if (!isMatch) {
      user.loginAttempt += 1;
      if (user.loginAttempt >= 3) {
        await mailer(user.email, user.userId); // Send alert mail
        user.loginAttempt = 0;
      }
      await user.save();

      return res.status(401).json({
        status: "FAILURE",
        message: "Incorrect password!!! Please try again....!!!"
      });
    }

    // Reset login attempts on success
    user.loginAttempt = 0;
    await user.save();

    return res.status(200).json({
      status: "SUCCESS",
      message: "Personal Notes Fetched!!",
      notes: personalNotes
    });

  } catch (e) {
    res.status(500).json(errorResponse("getPersonalNotes", e));
  }
};



const resetPassword = async (req, res) => {
  const { userId } = req.params;
  const { newPassword } = req.body;

  try {
    if (!newPassword) {
      return res.status(400).json({
        status: "FAILURE",
        message: "New password is required."
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updated = await Notes.updateMany(
      { userId, category: "personal" },
      { password: hashedPassword }
    );

    if (updated.modifiedCount === 0) {
      return res.status(404).json({
        status: "FAILURE",
        message: "No personal notes found for this user."
      });
    }

    res.status(200).json({
      status: "SUCCESS",
      message: "Password reset successfully."
    });

  } catch (e) {
    res.status(500).json(errorResponse("resetPassword", e));
  }
};



const updateNotes = async (req, res) => {
  const updateNotesId = req.params.notesId;
  try {
    const updateNotes = await Notes.findOneAndUpdate({ notesId: updateNotesId }, req.body, { new: true });
    if (!updateNotes) {
      res.status(400).json({
        status: "FAILURE",
        message: "No Notes Found!!!"
      });
    }
    else {
      res.status(200).json({
        status: "SUCCESS",
        message: "Updated Notes successfully",
        Notes: updateNotes
      })
    }

  }
  catch (e) {
    res.status(500).json(errorResponse("updateNotes", e));
  }
};

const deleteNotesById = async (req, res) => {
  const notesId = parseInt(req.params.notesId);
  try {
    const deleteNote = await Notes.findOneAndDelete({ notesId: notesId });
    if (!deleteNote) {
      return res.status(400).json({
        status: "FAILURE",
        message: "No Note Found!!!"

      });
    }
    res.status(200).json({
      status: "SUCCESS",
      message: "Note Deleted Successfully",
      notesId: notesId
    })
  }
  catch (e) {
    res.status(500).json(errorResponse("deleteNotes", e));
  }
};

module.exports = { createNotes, getAllNotes, getPersonalNotes, resetPassword,updateNotes, deleteNotesById };