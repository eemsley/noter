import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Create() {
  const navigate = useNavigate();
  const [text, setText] = React.useState("");
  const username = useSelector((state) => state.user.username);

  const createNote = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      text,
      username,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const response = await fetch("http://localhost:5000/notes", requestOptions);
    const result = await response.json();
    console.log(result);
    navigate(`/`);
  };

  return (
    <div className="h-screen flex items-center justify-start flex-col pt-10 bg-sky-800">
      <div className="flex flex-col h-1/2 w-3/4">
        <textarea
          className="h-full border rounded-xl p-2"
          onChange={(e) => setText(e.target.value)}
          placeholder="Type Here!"
        ></textarea>
        <div
          onClick={() => {
            if (text === "") return;
            else createNote();
          }}
          className={`flex flex-row h-10 w-full justify-center items-center rounded-lg mt-4 ${
            text === "" ? "bg-slate-200" : "bg-sky-100"
          }`}
        >
          <p className={`${text === "" ? "text-slate-400" : "text-sky-800"}`}>
            Create Note!
          </p>
        </div>
      </div>
    </div>
  );
}

export default Create;
