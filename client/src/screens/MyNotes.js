import React from "react";
import { useQuery } from "react-query";
import { Dots } from "react-activity";
import "react-activity/dist/library.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment";

function MyNotes() {
  const username = useSelector((state) => state.user.username);
  const navigate = useNavigate();

  const getNotes = async () => {
    const res = await fetch(`http://localhost:5000/users/${username}/notes`);
    console.log(res.json);
    return res.json();
  };
  const { data, error, isLoading } = useQuery("notes", getNotes);

  if (error) return <div>Request Failed</div>;
  if (isLoading)
    return (
      <div className=" h-screen flex flex-col w-full  items-center pt-48 bg-sky-800">
        <Dots color={"white"} />
      </div>
    );
  return (
    <div className="h-screen flex items-center justify-start flex-col pt-4  bg-sky-800">
      <div className="w-3/4 h-full flex flex-col overflow-y-scroll no-scrollbar p-4">
        {data.length === 0 && (
          <p className=" text-center text-sky-100 pt-48">
            Create a note to view it here!
          </p>
        )}
        {data.map((note) => {
          return (
            <div
              className="flex flex-col h-24 border-b border-white w-full rounded-lg bg-sky-100 shadow-2xl shadow-sky-100/30 p-2 my-2 "
              onClick={() => {
                navigate(`/note/${note.noteid}`);
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
    </div>
  );
}

export default MyNotes;
