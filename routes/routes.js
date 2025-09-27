const express = require("express");
const router = express.Router();
const notes = require("../controller/NotesController");
const userController = require("../controller/UserController");
const middleware = require("../middleware/middleware");

// User Routes

router.post("/signup", userController.createUser); // public
router.post("/login", userController.loginUser); // public
router.patch("/user/:userName", middleware.authMiddleware, userController.updateUser); // 🔐 protected
router.delete("/user/:userId",middleware.authMiddleware, userController.deleteUserById); // 🔐 protected
router.post("/notes/resetPassword/:userId",middleware.authMiddleware,userController.resetPasswordForUser);


//Notes Routes

router.get("/notes",middleware.authMiddleware,notes.getAllNotes);
router.post("/notes",middleware.authMiddleware,notes.createNotes);
router.post("/notes/personal",middleware.authMiddleware,notes.getPersonalNotes);
router.get("/notes/category/:category",middleware.authMiddleware,notes.getAllNotes);
router.get("/notes/:notesId",middleware.authMiddleware,notes.getAllNotes);
router.post("/notes/personal/resetPassword/:userId",middleware.authMiddleware,notes.resetPassword);
router.patch("/notes/:notesId",middleware.authMiddleware,notes.updateNotes);
router.delete("/notes/:notesId",middleware.authMiddleware,notes.deleteNotesById);


module.exports = router;