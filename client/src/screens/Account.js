//account screen with a logout button
import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Account() {
  const navigate = useNavigate();
  const username = useSelector((state) => state.user.username);
  return (
    <div className="h-screen flex items-center justify-start flex-col pt-4  bg-white">
      <div className="w-3/4 h-full flex flex-col overflow-y-scroll no-scrollbar p-4 space-y-4">
        <h1 className="text-2xl text-primary-800 pb-6 pl-2">
          My Account: {username}
        </h1>
        <button
          className="h-12 border rounded-xl p-2 bg-primary-200 shadow-lg text-primary-800"
          onClick={() => {
            navigate("/sharedWithMe");
          }}
        >
          Shared with Me
        </button>
        <button
          className="h-12 border rounded-xl p-2 bg-primary-200 shadow-lg text-primary-800"
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
