const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//middleware
app.use(cors());
app.use(express.json());

//ROUTES

//get all shared notes for a user
app.get("/users/:username/sharedNotes", async (req, res) => {
  try {
    const { username } = req.params;
    const note = await pool.query(
      "SELECT * FROM sharedNotes s join notes n ON n.noteid = s.noteid WHERE sharedWithName = $1;",
      [username]
    );
    res.json(note.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//get all users a note is shared with
app.get("/notes/:id/sharedWith", async (req, res) => {
  try {
    const { id } = req.params;
    const note = await pool.query(
      "SELECT sharedwithname FROM sharedNotes WHERE noteId = $1;",
      [id]
    );
    res.json(note.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//share note
app.post("/notes/:id/share", async (req, res) => {
  try {
    const { id } = req.params;
    const { authorName, sharedWithName } = req.body;
    //check if note is already shared with user
    if (authorName === sharedWithName) {
      res.json("You can't share a note with yourself!");
      return;
    }

    const alreadyShared = await pool.query(
      "SELECT * FROM sharedNotes WHERE noteId = $1 AND sharedWithName = $2",
      [id, sharedWithName]
    );
    if (alreadyShared.rows[0]) {
      //unshare note
      const unshareNote = await pool.query(
        "DELETE FROM sharedNotes WHERE noteId = $1 AND sharedWithName = $2",
        [id, sharedWithName]
      );
      res.json("Note " + id + " Unshared!");
      return;
    } else {
      const shareNote = await pool.query(
        "INSERT INTO sharedNotes (authorName, sharedWithName, noteId) VALUES($1, $2, $3) RETURNING *",
        [authorName, sharedWithName, id]
      );
      res.json(shareNote.rows[0]);
    }
  } catch (err) {
    console.error(err.message);
  }
});

//get all users
app.get("/users", async (req, res) => {
  try {
    const allUsers = await pool.query("SELECT * FROM users;");
    res.json(allUsers.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//create a user
app.post("/users", async (req, res) => {
  try {
    const { username, password } = req.body;
    const newUser = await pool.query(
      "INSERT INTO users (username, password) VALUES($1, $2) RETURNING *",
      [username, password]
    );
    res.json({ user: newUser.rows[0], taken: false });
  } catch (err) {
    console.log(JSON.stringify(err));
    res.json({ user: null, taken: true });
  }
});
//login a user
app.post("/users/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const userExists = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    const user = await pool.query(
      "SELECT * FROM users WHERE username = $1 AND password = $2",
      [username, password]
    );
    if (user.rows[0]) {
      res.json({ user: user.rows[0], loggedIn: true, userExists: true });
    } else {
      if (userExists.rows[0]) {
        res.json({ user: null, loggedIn: false, userExists: true });
      } else {
        res.json({ user: null, loggedIn: false, userExists: false });
      }
    }
  } catch (err) {
    console.log(JSON.stringify(err));
    res.json({ user: null, loggedIn: false });
  }
});

//create a note
app.post("/notes", async (req, res) => {
  try {
    const { text, username } = req.body;
    const newNote = await pool.query(
      "INSERT INTO notes (text, username) VALUES($1, $2) RETURNING *",
      [text, username]
    );
    res.json(newNote.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//get all notes
app.get("/notes", async (req, res) => {
  try {
    const allNotes = await pool.query("SELECT * FROM notes;");
    res.json(allNotes.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//get a note
app.get("/notes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const note = await pool.query("SELECT * FROM notes WHERE noteid = $1;", [
      id,
    ]);
    res.json(note.rows);
  } catch (err) {
    console.error(err.message);
  }
});
//get a username's notes
app.get("/users/:username/notes", async (req, res) => {
  try {
    const { username } = req.params;
    const note = await pool.query("SELECT * FROM notes WHERE username = $1;", [
      username,
    ]);
    res.json(note.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//update a note
app.put("/notes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const updateNote = await pool.query(
      "UPDATE notes SET text = $2 WHERE noteId = $1",
      [id, text]
    );
    res.json("Note " + id + " Updated!");
  } catch (err) {
    console.error(err.message);
  }
});

//delete a note
app.delete("/notes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = pool.query("DELETE FROM notes WHERE noteId=$1 CASCADE", [
      id,
    ]);
    res.json("Note " + id + " Deleted!");
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(5000, () => {
  console.log("server connected, port 5000");
});
