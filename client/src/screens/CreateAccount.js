import React from "react";
import "react-activity/dist/library.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUsername as setGlobalUsername } from "../redux/userSlice";

function CreateAccount() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [taken, setTaken] = useState(false);
  const [match, setMatch] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const createUser = async (username, password) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      username,
      password,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const response = await fetch(
      "http://localhost:5000/users/",
      requestOptions
    );
    const result = await response.json();
    console.log(JSON.stringify(result));
    if (result.taken === true) {
      setTaken(true);
    } else {
      dispatch(setGlobalUsername(username));
      navigate("/");
    }
  };

  return (
    <div className="h-screen flex items-center justify-start flex-col pt-4  bg-sky-800">
      <div className="w-3/4 h-full flex flex-col overflow-y-scroll no-scrollbar p-4 space-y-2">
        <h1 className="text-xl text-sky-100 pb-6">Create an Account</h1>
        <input
          className="h-12 border rounded-xl p-2"
          type="text"
          placeholder="Username"
          onChange={(e) => {
            setUsername(e.target.value);
            setTaken(false);
          }}
        />
        <input
          className="h-12 border rounded-xl p-2"
          type="text"
          placeholder="Password"
          onChange={(e) => {
            setPassword(e.target.value);
            setTaken(false);
            setMatch(true);
          }}
        />{" "}
        <input
          className="h-12 border rounded-xl p-2"
          type="text"
          placeholder="Confirm Password"
          onChange={(e) => {
            setConfirm(e.target.value);
            setTaken(false);
            setMatch(true);
          }}
        />
        {taken && <p className="text-red-200 text-xs pl-2">Username taken!</p>}
        {!match && (
          <p className="text-red-200 text-xs pl-2">Passwords don't match!</p>
        )}
        {!taken && match && <p className="text-transparent text-xs">...</p>}
        <button
          className="h-12 border rounded-xl p-2 bg-sky-100 "
          onClick={() => {
            if (confirm !== password) {
              setMatch(false);
              return;
            }
            if (username !== "" && password !== "" && confirm === password)
              createUser(username, password);
          }}
        >
          Submit
        </button>
        <div
          onClick={() => {
            navigate("/login");
          }}
        >
          <p className="text-center text-xs pt-10 text-sky-100">
            {"Back to login"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CreateAccount;
