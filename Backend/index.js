const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

//middleware
app.use(cors());
app.use(express.json());

//ROUTES

//get shared notes for a user (2 ORM)
app.get("/users/:username/sharedNotes", async (req, res) => {
  try {
    const { username } = req.params;
    //ORM
    const allSharedNotes = await prisma.sharednotes.findMany({
      where: { sharedwithname: username },
    });
    const noteIds = allSharedNotes.map((n) => n.noteid);
    //ORM
    const notes = await prisma.notes.findMany({
      where: { noteid: { in: noteIds } },
    });
    console.log("GET SHARED NOTES: " + username);
    res.json(notes);
  } catch (err) {
    console.error(err.message);
  }
});

//get users a note is shared with (1 ORM)
app.get("/notes/:id/sharedWith", async (req, res) => {
  try {
    const { id } = req.params;
    //ORM
    const notes = await prisma.sharednotes.findMany({
      where: { noteid: parseInt(id) },
    });
    console.log("GET SHARED WITH: " + id);
    res.json(notes.map((n) => n.sharedwithname));
  } catch (err) {
    console.error(err.message);
  }
});

//share note (2 ORM, 1 SP)
app.post("/notes/:id/share", async (req, res) => {
  try {
    const { id } = req.params;
    const { authorName, sharedWithName } = req.body;
    if (authorName === sharedWithName) {
      res.json("You can't share a note with yourself!");
      return;
    }
    //ORM
    const alreadyShared = await prisma.sharednotes.findFirst({
      where: {
        noteid: parseInt(id),
        sharedwithname: sharedWithName,
        authorname: authorName,
      },
    });

    if (alreadyShared) {
      //SP
      const unshareNote = await prisma.sharednotes.deleteMany({
        where: {
          noteid: parseInt(id),
          sharedwithname: sharedWithName,
          authorname: authorName,
        },
      });
      console.log("UNSHARE: " + id + ", " + sharedWithName);
      res.json("Note " + id + " Unshared!");
      return;
    } else {
      //SP
      const shareNote = await pool.query("CALL share_note($1, $2, $3);", [
        id,
        authorName,
        sharedWithName,
      ]);
      console.log("SHARE: " + id + ", " + sharedWithName);
      res.json("Note " + id + " Shared!");
    }
  } catch (err) {
    console.error(err.message);
  }
});

//get all users (1 ORM)
app.get("/users", async (req, res) => {
  try {
    //ORM
    const allUsers = await prisma.users.findMany();
    console.log("GET ALL USERS");
    res.json(allUsers);
  } catch (err) {
    console.error(err.message);
  }
});

//create a user (1 SP)
app.post("/users", async (req, res) => {
  try {
    const { username, password } = req.body;
    // SP
    const newUser = await pool.query("CALL create_new_user($1, $2);", [
      username,
      password,
    ]);
    console.log("CREATE USER: " + username);
    res.json({ user: { username, password }, taken: false });
  } catch (err) {
    res.json({ user: null, taken: true });
  }
});

//login a user (2 ORM)
app.post("/users/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    //ORM
    const userExists = await prisma.users.findUnique({
      where: { username: username },
    });
    //ORM
    const user = await prisma.users.findUnique({
      where: { username: username, password: password },
    });
    if (user) {
      console.log("LOGIN: " + username);
      res.json({ user: user, loggedIn: true, userExists: true });
    } else {
      if (userExists) {
        console.log("INCORRECT PASSWORD: " + username);
        res.json({ user: null, loggedIn: false, userExists: true });
      } else {
        console.log("USER NOT FOUND: " + username);
        res.json({ user: null, loggedIn: false, userExists: false });
      }
    }
  } catch (err) {
    res.json({ user: null, loggedIn: false });
  }
});

//search all notes (1 ORM)
app.get("/notes/search/:searchText", async (req, res) => {
  try {
    const { searchText } = req.params;
    //ORM
    const notes = await prisma.notes.findMany({
      where: { text: { contains: searchText } },
    });
    console.log("SEARCH TEXT: " + searchText);
    res.json(notes);
  } catch (err) {
    console.error(err.message);
  }
});
//search all notes (1 ORM)
app.get("/notes/searchUsers/:searchText", async (req, res) => {
  try {
    const { searchText } = req.params;
    //ORM
    const notes = await prisma.notes.findMany({
      where: { username: { contains: searchText } },
    });
    console.log("SEARCH USERS: " + searchText);
    res.json(notes);
  } catch (err) {
    console.error(err.message);
  }
});

//get all notes (4 ORM)
app.get("/notes/all/:orderBy", async (req, res) => {
  try {
    //ORM
    const { orderBy } = req.params;
    let allNotes;
    if (orderBy === "oldest")
      allNotes = await prisma.notes.findMany({
        orderBy: { createdat: "asc" },
      });
    else if (orderBy === "user")
      allNotes = await prisma.notes.findMany({
        orderBy: { username: "asc" },
      });
    else if (orderBy === "text")
      allNotes = await prisma.notes.findMany({ orderBy: { text: "asc" } });
    else
      allNotes = await prisma.notes.findMany({
        orderBy: { createdat: "desc" },
      });
    console.log("GET ALL NOTES: " + orderBy);
    res.json(allNotes);
  } catch (err) {
    console.error(err.message);
  }
});

//get a note (1 ORM)
app.get("/notes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    //ORM
    const note = await prisma.notes.findFirst({
      where: { noteid: parseInt(id) },
    });
    console.log("GET NOTE: " + id);
    res.json(note);
  } catch (err) {
    console.error(err.message);
  }
});

//get a username's notes (1 ORM)
app.get("/users/:username/notes", async (req, res) => {
  try {
    const { username } = req.params;
    //ORM
    const notes = await prisma.notes.findMany({
      where: { username: username },
    });
    console.log("GET NOTES:" + username);
    res.json(notes);
  } catch (err) {
    console.error(err.message);
  }
});

//create a note (1 SP)
app.post("/notes", async (req, res) => {
  try {
    const { text, username } = req.body;
    //SP
    const newNote = await pool.query("CALL create_new_note($1, $2);", [
      text,
      username,
    ]);
    console.log("CREATE:" + text + ", " + username);
    res.json("Note Created!");
  } catch (err) {
    console.error(err.message);
  }
});

//update a note (1 SP)
app.put("/notes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    //SP
    const updateNote = await pool.query("CALL update_note($1, $2);", [
      id,
      text,
    ]);
    console.log("UPDATE:" + id + ", " + text);
    res.json("Note " + id + " Updated!");
  } catch (err) {
    console.error(err.message);
  }
});

//delete a note (1 SP)
app.delete("/notes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    //SP
    const deleteNote = pool.query("CALL delete_note($1);", [id]);
    console.log("DELETE:" + id);
    res.json("Note " + id + " Deleted!");
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(5000, () => {
  console.log("server connected, port 5000");
});
