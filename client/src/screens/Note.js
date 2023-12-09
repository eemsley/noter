import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

import { useQuery } from "react-query";
import { useSelector } from "react-redux";

function Note() {
  const navigate = useNavigate();
  const { id } = useParams();
  const username = useSelector((state) => state.user.username);
  const [text, setText] = useState("");
  const [updated, setUpdated] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showUsers, setShowUsers] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  useEffect(() => {
    if (searchText === "") {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(
        users.filter((user) => {
          return user.username.includes(searchText);
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);
  const shareNote = async (sharedWithName) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      authorName: username,
      sharedWithName: sharedWithName,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    await fetch(`http://localhost:5000/notes/${id}/share`, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));

    await refetchSharedUsers();
  };

  const deleteNote = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = "";

    var requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    await fetch(`http://localhost:5000/notes/${id}`, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));

    navigate("/");
  };
  const editNote = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      text: text,
    });

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    await fetch(`http://localhost:5000/notes/${id}`, requestOptions)
      .then((response) => {
        setUpdated(true);
        response.text();
      })
      .then((result) => {
        setUpdated(true);
        console.log(result);
      })
      .catch((error) => console.log("error", error));
  };
  const getNote = async () => {
    const res = await fetch(`http://localhost:5000/notes/${id}`);
    console.log(res.json);
    return res.json();
  };
  const getSharedUsers = async () => {
    const res = await fetch(`http://localhost:5000/notes/${id}/sharedWith`);
    return res.json();
  };
  const { data: sharedUsers, refetch: refetchSharedUsers } = useQuery(
    "sharedUsers",
    getSharedUsers
  );
  // Using the hook
  const getUsers = async () => {
    const res = await fetch(`http://localhost:5000/users`);
    return res.json();
  };
  const { data: note, isLoading: isNoteLoading } = useQuery("note", getNote);
  const { data: users, isLoading: isUsersLoading } = useQuery(
    "users",
    getUsers
  );
  useEffect(() => {
    if (note) setText(note.text);
  }, [note, isNoteLoading]);

  return (
    <div className="h-screen flex items-center justify-start flex-col pt-10 bg-primary-800">
      {!isNoteLoading && note && (
        <div className="flex flex-col h-1/2 w-3/4">
          <textarea
            className="h-full border rounded-xl p-2"
            onChange={(e) => {
              setUpdated(false);
              setText(e.target.value);
            }}
            value={text}
          ></textarea>
          <div
            onClick={() => {
              if (text === "") return;
              else editNote();
            }}
            className={`flex flex-row w-full justify-center items-center rounded-lg mt-4 ${
              text === "" ? "bg-slate-200" : "bg-primary-100"
            }`}
          >
            <p
              className={`${
                text === "" ? "text-slate-400" : "text-primary-800"
              }`}
            >
              {updated ? "Success!" : "Update Note!"}
            </p>
          </div>
          {username === note.username && (
            <div
              onClick={() => {
                deleteNote();
              }}
              className={`flex flex-row w-full justify-center items-center rounded-lg mt-4 ${"bg-red-300"}`}
            >
              <p className={`text-red-800`}>Delete Note</p>
            </div>
          )}
          {username === note.username && (
            <div
              onClick={() => {
                setShowUsers(true);
              }}
              className={`flex flex-row w-full justify-center items-center rounded-lg mt-4 ${"bg-emerald-300"}`}
            >
              <p className={`text-emerald-800`}>Share Note</p>
            </div>
          )}
        </div>
      )}
      {showUsers && (
        <div className="bg-primary-200/90 w-[50%] h-[50%] absolute rounded-xl flex flex-col justify-center items-center">
          <div className="h-[15%] w-full flex flex-row items-center justify-between px-4">
            <p className="text-primary-800 text-xl text-center">Share Note</p>
            <input
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
              className="text-primary-800 text-sm text-left px-2 rounded-full justify-center items-center mt-1 mr-10"
              placeholder="Search"
            />
            <button
              onClick={() => setShowUsers(false)}
              className="text-xs text-primary-900 bg-primary-100 h-6 w-6 rounded-full justify-center items-center text-center"
            >
              x
            </button>
          </div>
          <div className="h-[85%] w-[95%] bg-white justify-start items-center flex rounded-xl flex-col p-2 overflow-y-scroll">
            {isUsersLoading && <p>Loading...</p>}
            {!isUsersLoading &&
              users &&
              filteredUsers?.map((user) => {
                return (
                  <button
                    onClick={() => {
                      shareNote(user.username);
                    }}
                    className="w-full bg-primary-100 rounded-xl py-2 pl-2 items-center flex flex-row mb-2 text-sm text-primary-900 justify-between pr-2"
                  >
                    <div className="text-primary-900">{user.username}</div>

                    {sharedUsers?.includes(user.username) ? (
                      <div className="text-primary-800 flex flex-row">
                        <p className="text-xs pt-1 pr-2">Shared!</p>{" "}
                        <CheckBoxIcon />
                      </div>
                    ) : (
                      <div className="h-6 w-6">
                        <p className="text-xs pt-1 mr-2">
                          {username === user.username && "(me)"}
                        </p>
                      </div>
                    )}
                  </button>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Note;
