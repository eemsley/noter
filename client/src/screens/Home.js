import React from "react";
import { useQuery } from "react-query";
import { Dots } from "react-activity";
import CloseIcon from "@mui/icons-material/Close";
import "react-activity/dist/library.css";
import { useNavigate } from "react-router-dom";
import moment from "moment";

import { useSelector } from "react-redux";

function Home() {
  const username = useSelector((state) => state.user.username);
  const navigate = useNavigate();
  const [searchText, setSearchText] = React.useState("");

  const updateNotes = async () => {
    await refetchNotes();
  };
  const getNotes = async () => {
    if (searchText === "") {
      const res = await fetch("http://localhost:5000/notes");
      return res.json();
    } else {
      const res = await fetch(
        `http://localhost:5000/notes/search/${searchText}`
      );
      console.log(res.json);
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
          <p className="text-sky-100 text-2xl">Search All Notes</p>
          <div className="flex flex-row justify-center items-center">
            <input
              className="w-48 h-8 rounded-lg px-2"
              placeholder="Search"
              value={searchText}
              onChange={async (e) => {
                await setSearchText(e.target.value);
                await updateNotes();
              }}
            />
            <button
              onClick={async () => {
                await setSearchText("");
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
