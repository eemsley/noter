import React from "react";
import "react-activity/dist/library.css";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUsername as setGlobalUsername } from "../redux/userSlice";

import { useNavigate } from "react-router-dom";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userExists, setUserExists] = useState(true);
  const [passwordCorrect, setPasswordCorrect] = useState(true);
  const login = async (username, password) => {
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
      "http://localhost:5000/users/login",
      requestOptions
    );
    const result = await response.json();
    console.log(JSON.stringify(result));
    if (result.loggedIn === false && result.userExists === true) {
      setPasswordCorrect(false);
    } else if (result.loggedIn === false && result.userExists === false) {
      setUserExists(false);
    } else if (result.loggedIn === true) {
      //logged in
      dispatch(setGlobalUsername(username));
      navigate("/");
    } else {
      alert("Unexpected Error Occured. Please try again.");
      //error
    }
  };

  return (
    <div className="h-screen flex items-center justify-start flex-col pt-4  bg-sky-800">
      <div className="w-3/4 h-full flex flex-col overflow-y-scroll no-scrollbar p-4 space-y-2">
        <h1 className="text-xl text-sky-100 pb-6">Login to Noter</h1>
        <input
          className="h-12 border rounded-xl p-2"
          type="text"
          placeholder="Username"
          onChange={(e) => {
            setPasswordCorrect(true);
            setUserExists(true);
            setUsername(e.target.value);
          }}
        />
        <input
          className="h-12 border rounded-xl p-2"
          type="password"
          placeholder="Password"
          onChange={(e) => {
            setPasswordCorrect(true);
            setUserExists(true);
            setPassword(e.target.value);
          }}
        />
        {!userExists && (
          <p className="text-red-200 text-xs pl-2">User not found!</p>
        )}
        {!passwordCorrect && (
          <p className="text-red-200 text-xs pl-2">Incorrect password!</p>
        )}
        {passwordCorrect && userExists && (
          <p className="text-transparent text-xs">...</p>
        )}
        <button
          className="h-12 border rounded-xl p-2 bg-sky-100"
          onClick={() => {
            if (username !== "" && password !== "") login(username, password);
          }}
        >
          Submit
        </button>
        <div
          onClick={() => {
            navigate("/createAccount");
          }}
        >
          <p className="text-center text-xs pt-10 text-sky-100">
            Don't have an account? Create one!
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
