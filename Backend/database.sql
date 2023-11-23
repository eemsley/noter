CREATE DATABASE noter;

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

/*create a procedure to delete a note*/
CREATE PROCEDURE delete_note(id integer)
LANGUAGE SQL
AS $$
DELETE FROM notes WHERE noteId = id;
$$;


/*create a procedure to update a note*/
CREATE PROCEDURE update_note(id integer, new varchar(255))
LANGUAGE SQL
AS $$
UPDATE notes SET text = new WHERE noteId = id;
$$;

/* procedure to create a new note */
CREATE PROCEDURE create_new_note (text varchar(255), username varchar(255))
LANGUAGE SQL
AS $$
INSERT INTO notes (text, username) VALUES(text, username) RETURNING *
$$;

/* procedure for creating a new user */
CREATE PROCEDURE create_new_user (username varchar(255), password varchar(255))
LANGUAGE SQL
AS $$
INSERT INTO users (username, password) VALUES(username, password) RETURNING *
$$;



/* procedure for sharing a note */
CREATE PROCEDURE share_note (noteId integer, authorName varchar(255), sharedWithName varchar(255))
LANGUAGE SQL
AS $$
INSERT INTO sharedNotes (noteId, authorName, sharedWithName) VALUES(noteId, authorName, sharedWithName) RETURNING *
$$;
