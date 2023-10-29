const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//middleware
app.use(cors());
app.use(express.json());

//ROUTES

//create a note
app.post("/notes", async (req, res) => {
  try {
    const { text } = req.body;
    const newNote = await pool.query(
      "INSERT INTO notes (text) VALUES($1) RETURNING *",
      [text]
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
    const deleteTodo = pool.query("DELETE FROM notes WHERE noteId=$1", [id]);
    res.json("Note " + id + " Deleted!");
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(5000, () => {
  console.log("server connected, port 5000");
});
