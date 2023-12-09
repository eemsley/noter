import React from "react";
import { useQuery } from "react-query";
import { Dots } from "react-activity";
import CloseIcon from "@mui/icons-material/Close";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import "react-activity/dist/library.css";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { useSelector } from "react-redux";

function Home() {
  const username = useSelector((state) => state.user.username);
  const navigate = useNavigate();
  const [searchText, setSearchText] = React.useState("");
  const [searchUsers, setSearchUsers] = React.useState("");
  const [dropDownVisible, setDropDownVisible] = React.useState(false);
  const [sortBy, setSortBy] = React.useState("newest");

  const updateNotes = async () => {
    await refetchNotes();
  };
  const likeNote = async (noteId) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      username: username,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    await fetch(`http://localhost:5000/notes/${noteId}/like`, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
    await refetchNotes();
  };

  const getNotes = async () => {
    if (searchText === "" && searchUsers === "") {
      const res = await fetch(`http://localhost:5000/notes/all/${sortBy}`);
      return res.json();
    } else if (searchUsers !== "") {
      const res = await fetch(
        `http://localhost:5000/notes/searchUsers/${searchUsers}`
      );
      console.log(res.json);
      return res.json();
    } else if (searchText !== "") {
      const res = await fetch(
        `http://localhost:5000/notes/search/${searchText}`
      );
      return res.json();
    }
  };
  const {
    data,
    error,
    isLoading,
    refetch: refetchNotes,
    isRefetching,
  } = useQuery("notes", getNotes);

  if (error) return <div>Request Failed</div>;

  return (
    <div className="h-screen flex items-center justify-start flex-col pt-4  bg-white">
      <div className="w-3/4 h-full flex flex-col overflow-y-scroll no-scrollbar p-4">
        <div className="w-full flex flex-row justify-between items-center">
          <div>
            <button
              onClick={() => setDropDownVisible(!dropDownVisible)}
              className="rounded-full p-1 bg-primary-200 flex-row w-32 flex justify-evenly shadow-lg"
            >
              <p className="text-primary-800">Order By</p>
              <ArrowDropDown className="text-primary-800" />
            </button>

            {dropDownVisible && (
              <div className="absolute flex flex-col text-xs bg-primary-100/80 rounded-lg p-1 mt-2 w-32 space-y-1">
                <button
                  onClick={async () => {
                    await setSortBy("newest");
                    await setSearchText("");
                    await updateNotes();
                  }}
                  className={`w-full h-8 rounded-lg ${
                    sortBy === "newest" ? "bg-primary-800" : "bg-primary-800/50"
                  } text-primary-100`}
                >
                  Newest
                </button>
                <button
                  onClick={async () => {
                    await setSortBy("oldest");
                    await setSearchText("");
                    await updateNotes();
                  }}
                  className={`w-full h-8 rounded-lg ${
                    sortBy === "oldest" ? "bg-primary-800" : "bg-primary-800/50"
                  } text-primary-100`}
                >
                  Oldest
                </button>
                <button
                  onClick={async () => {
                    await setSortBy("text");
                    await setSearchText("");
                    await updateNotes();
                  }}
                  className={`w-full h-8 rounded-lg ${
                    sortBy === "text" ? "bg-primary-800" : "bg-primary-800/50"
                  } text-primary-100`}
                >
                  Alphebetical by Text
                </button>
                <button
                  onClick={async () => {
                    await setSortBy("user");
                    await setSearchText("");
                    await updateNotes();
                  }}
                  className={`w-full h-8 rounded-lg ${
                    sortBy === "user" ? "bg-primary-800" : "bg-primary-800/50"
                  } text-primary-100`}
                >
                  Alphebetical by User
                </button>
              </div>
            )}
          </div>
          {/* <div>
            <button
              onClick={() => setColorDropDown(!colorDropDown)}
              className="rounded-full p-1 bg-primary-200 shadow-lg flex-row w-32 flex justify-evenly"
            >
              <p className="text-primary-800">Colors</p>
              <ArrowDropDown className="text-primary-800" />
            </button>

            {colorDropDown && (
              <div className="absolute flex flex-col text-xs bg-primary-100/80 rounded-lg p-1 mt-2 w-32 space-y-1">
                <button
                  onClick={async () => {
                    dispatch(setColor("sky"));
                  }}
                  className={`w-full h-8 rounded-lg ${
                    currentColor === "sky" ? "bg-sky-800" : "bg-sky-800/50"
                  } text-primary-100`}
                >
                  Blue
                </button>
                <button
                  onClick={async () => {
                    dispatch(setColor("green"));
                  }}
                  className={`w-full h-8 rounded-lg ${
                    currentColor === "green"
                      ? "bg-green-800"
                      : "bg-green-800/50"
                  } text-primary-100`}
                >
                  Green
                </button>
                <button
                  onClick={async () => {
                    dispatch(setColor("purple"));
                  }}
                  className={`w-full h-8 rounded-lg ${
                    currentColor === "purple"
                      ? "bg-purple-800"
                      : "bg-purple-800/50"
                  } text-primary-100`}
                >
                  Purple
                </button>
                <button
                  onClick={async () => {
                    dispatch(setColor("orange"));
                  }}
                  className={`w-full h-8 rounded-lg ${
                    currentColor === "orange"
                      ? "bg-orange-800"
                      : "bg-orange-800/50"
                  } text-primary-100`}
                >
                  Orange
                </button>
              </div>
            )}
          </div> */}
          <div className="flex flex-row justify-center items-center">
            <input
              className="w-48 h-8 rounded-lg px-2 bg-primary-100 shadow-lg"
              onClick={async () => {
                await setSearchText("");
                await refetchNotes();
              }}
              placeholder="Search Users"
              value={searchUsers}
              onChange={async (e) => {
                await setSearchUsers(e.target.value);
                await updateNotes();
              }}
            />
            <button
              onClick={async () => {
                await setSearchUsers("");
                await updateNotes();
              }}
              className=" h-4 w-4 rounded-full justify-center items-center flex bg-primary-100 shadow-lg text-primary-900  ml-2"
            >
              <CloseIcon fontSize={"xs"} />
            </button>
          </div>
          <div className="flex flex-row justify-center items-center">
            <input
              onClick={async () => {
                await setSearchUsers("");
                await refetchNotes();
              }}
              className="w-48 h-8 rounded-lg px-2 bg-primary-100 shadow-lg"
              placeholder="Search Notes"
              value={searchText}
              onChange={async (e) => {
                await setSearchText(e.target.value);
                setSearchUsers("");
                await updateNotes();
              }}
            />
            <button
              onClick={async () => {
                await setSearchText("");
                setSearchUsers("");
                await updateNotes();
              }}
              className=" h-4 w-4 rounded-full justify-center items-center flex bg-primary-100 text-primary-900  ml-2"
            >
              <CloseIcon fontSize="xs" />
            </button>
          </div>
        </div>
        {isLoading || isRefetching ? (
          <div className=" h-screen flex flex-col w-full  items-center pt-48 bg-white">
            <Dots color={"gray"} />
          </div>
        ) : (
          <div className="pt-8">
            {data.length === 0 && (
              <p className=" text-center text-primary-800 pt-48">
                Notes from all users will appear here!
              </p>
            )}
            {data.map((note) => {
              return (
                <div
                  className="flex flex-col h-24 w-full rounded-lg bg-primary-200 shadow-lg p-2 my-4 z-10"
                  onClick={() => {
                    if (note.username === username)
                      navigate(`/note/${note.noteid}`);
                    else return;
                  }}
                >
                  <div></div>
                  <div className="w-full  h-5/6 flex flex-row">
                    <p className=" text-primary-900">{note.text}</p>
                  </div>
                  <div className="w-full h-1/6 justify-end items-end">
                    <p className=" text-primary-800 text-right text-xs">
                      {moment(note.createdat).fromNow()} by{" "}
                      {note.username === username ? "me" : note.username}
                    </p>
                    <p className=" text-primary-800 text-right text-xs"></p>
                  </div>
                  <button
                    className={`${
                      note.likes.find((like) => like.username === username)
                        ? "text-primary-800"
                        : "text-primary-400"
                    } text-xs z-50 h-5 w-5 flex flex-row justify-center items-center pl-2 `}
                    onClick={async () => await likeNote(note.noteid)}
                    disabled={username === "guest"}
                  >
                    <FavoriteIcon />
                    {note.likes.length}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
