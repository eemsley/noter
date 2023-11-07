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

/* create a trigger to delete any sharedNotes when a note is deleted from the notes table*/
CREATE OR REPLACE FUNCTION delete_notes() RETURNS TRIGGER AS $$
    BEGIN                 
        DELETE FROM sharedNotes WHERE noteId = OLD.noteId;                    
        RETURN OLD;
    END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_delete_note
BEFORE DELETE ON notes
    FOR EACH ROW EXECUTE PROCEDURE delete_notes();