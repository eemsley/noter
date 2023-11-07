import React from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Header() {
  const location = useLocation();
  const username = useSelector((state) => state.user.username);

  return (
    location.pathname !== "/login" &&
    location.pathname !== "/createAccount" && (
      <div className="w-full flex flex-row justify-between px-4 pt-4 border-b border-white pb-2">
        <Link to={"/"}>
          <div className="p-1 bg-sky-100 rounded-lg mt-3">
            <p className="text-sky-900">All Notes</p>
          </div>
        </Link>
        <Link to={"/MyNotes"}>
          <div className="p-1 bg-sky-100 rounded-lg mt-3">
            <p className="text-sky-900">My Notes</p>
          </div>
        </Link>
        <h1 className="text-4xl text-sky-800">Noter</h1>
        <Link to={"/create"}>
          <div className="p-1 bg-sky-100 rounded-lg mt-3">
            <p className="text-sky-900">+ New Note </p>
          </div>
        </Link>
        <Link to={username === "guest" ? "/login" : "/account"}>
          {username === "guest" ? (
            <div className="p-1 bg-sky-100 rounded-lg mt-3 text-sky-900">
              Login!
            </div>
          ) : (
            <div className="bg-sky-100 text-sky-800 h-10 w-10 rounded-full flex  justify-center items-center mt-2">
              <p className="">{username[0].toString().toUpperCase()}</p>
            </div>
          )}
        </Link>
      </div>
    )
  );
}

export default Header;
