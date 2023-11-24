import React from "react";
import { useQuery } from "react-query";
import { Dots } from "react-activity";
import CloseIcon from "@mui/icons-material/Close";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import "react-activity/dist/library.css";
import { useNavigate } from "react-router-dom";
import moment from "moment";

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
    <div className="h-screen flex items-center justify-start flex-col pt-4  bg-sky-800">
      <div className="w-3/4 h-full flex flex-col overflow-y-scroll no-scrollbar p-4">
        <div className="w-full flex flex-row justify-between items-center">
          <div>
            <div
              onClick={() => setDropDownVisible(!dropDownVisible)}
              className="rounded-full p-1 bg-sky-100 flex-row w-32 flex justify-evenly"
            >
              <p className="text-sky-800">Order By</p>
              <ArrowDropDown className="text-sky-800" />
            </div>
            {dropDownVisible && (
              <div className="absolute flex flex-col text-xs bg-sky-100/80 rounded-lg p-1 mt-2 w-32 space-y-1">
                <button
                  onClick={async () => {
                    await setSortBy("newest");
                    await setSearchText("");
                    await updateNotes();
                  }}
                  className={`w-full h-8 rounded-lg ${
                    sortBy === "newest" ? "bg-sky-800" : "bg-sky-800/50"
                  } text-sky-100`}
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
                    sortBy === "oldest" ? "bg-sky-800" : "bg-sky-800/50"
                  } text-sky-100`}
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
                    sortBy === "text" ? "bg-sky-800" : "bg-sky-800/50"
                  } text-sky-100`}
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
                    sortBy === "user" ? "bg-sky-800" : "bg-sky-800/50"
                  } text-sky-100`}
                >
                  Alphebetical by User
                </button>
              </div>
            )}
          </div>
          <div className="flex flex-row justify-center items-center">
            <input
              className="w-48 h-8 rounded-lg px-2"
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
              className=" h-6 w-6 rounded-full justify-center items-center flex bg-sky-100 text-sky-900  ml-2"
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
              className="w-48 h-8 rounded-lg px-2"
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
              className=" h-6 w-6 rounded-full justify-center items-center flex bg-sky-100 text-sky-900  ml-2"
            >
              <CloseIcon fontSize={"xs"} />
            </button>
          </div>
        </div>
        {isLoading || isRefetching ? (
          <div className=" h-screen flex flex-col w-full  items-center pt-48 bg-sky-800">
            <Dots color={"white"} />
          </div>
        ) : (
          <div>
            {data.length === 0 && (
              <p className=" text-center text-sky-100 pt-48">
                Notes from all users will appear here!
              </p>
            )}
            {data.map((note) => {
              return (
                <div
                  className="flex flex-col h-24 border-b border-white w-full rounded-lg bg-sky-100 shadow-2xl shadow-sky-100/30 p-2 my-2 "
                  onClick={() => {
                    if (note.username === username)
                      navigate(`/note/${note.noteid}`);
                    else return;
                  }}
                >
                  <div className="w-full  h-5/6 flex flex-row">
                    <p className=" text-sky-900">{note.text}</p>
                  </div>
                  <div className="w-full h-1/6 justify-end items-end">
                    <p className=" text-sky-800 text-right text-xs">
                      {moment(note.createdat).fromNow()} by{" "}
                      {note.username === username ? "me" : note.username}
                    </p>
                    <p className=" text-sky-800 text-right text-xs"></p>
                  </div>
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
