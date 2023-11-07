CREATE DATABASE noter;
/* create a table users which has a username as the primary key and password*/

CREATE TABLE users(
    username VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255)
);

CREATE TABLE notes(
    noteId SERIAL PRIMARY KEY,
    text VARCHAR(255),
    createdat TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    username VARCHAR(255) REFERENCES users(username)
);
CREATE TABLE sharedNotes(
    sharedId SERIAL PRIMARY KEY,
    authorName VARCHAR(255) REFERENCES users(username),
    sharedWithName VARCHAR(255) REFERENCES users(username),
    noteId INTEGER REFERENCES notes(noteId)
);
