//account screen with a logout button
import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Account() {
  const navigate = useNavigate();
  const username = useSelector((state) => state.user.username);
  return (
    <div className="h-screen flex items-center justify-start flex-col pt-4  bg-sky-800">
      <div className="w-3/4 h-full flex flex-col overflow-y-scroll no-scrollbar p-4 space-y-2">
        <h1 className="text-2xl text-sky-100 pb-6 pl-2">
          My Account: {username}
        </h1>
        <button
          className="h-12 border rounded-xl p-2 bg-sky-100 text-sky-900"
          onClick={() => {
            navigate("/sharedWithMe");
          }}
        >
          Shared with Me
        </button>
        <button
          className="h-12 border rounded-xl p-2 bg-sky-100 text-sky-900"
          onClick={() => {
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Account;
