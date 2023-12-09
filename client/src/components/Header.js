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
      <div className="w-full flex flex-row justify-evenly px-4 pt-4 bg-primary-400 pb-2">
        <h1 className="text-4xl text-primary-50">Noter</h1>

        {username !== "guest" ? (
          <Link to={"/report"}>
            <div
              className={`p-1 ${
                location.pathname === "/report"
                  ? "bg-primary-50"
                  : "bg-primary-200"
              } rounded-lg mt-3`}
            >
              <p className="text-primary-900">Report</p>
            </div>
          </Link>
        ) : (
          <div></div>
        )}
        {username !== "guest" ? (
          <Link to={"/"}>
            <div
              className={`p-1 ${
                location.pathname === "/" ? "bg-primary-50" : "bg-primary-200"
              } rounded-lg mt-3`}
            >
              <p className="text-primary-900">All Notes</p>
            </div>
          </Link>
        ) : (
          <div></div>
        )}
        {username !== "guest" && (
          <Link to={"/MyNotes"}>
            <div
              className={`p-1 rounded-lg mt-3 ${
                location.pathname === "/MyNotes"
                  ? "bg-primary-50"
                  : "bg-primary-200"
              }`}
            >
              <p className="text-primary-900">My Notes</p>
            </div>
          </Link>
        )}
        {username !== "guest" && (
          <Link to={"/create"}>
            <div
              className={`p-1 rounded-lg mt-3 ${
                location.pathname === "/create"
                  ? "bg-primary-50"
                  : "bg-primary-200"
              }`}
            >
              <p className="text-primary-900">+ New Note </p>
            </div>
          </Link>
        )}
        <Link to={username === "guest" ? "/login" : "/account"}>
          {username === "guest" ? (
            <div className="p-1 bg-primary-50 rounded-lg mt-3 text-primary-900">
              Login!
            </div>
          ) : (
            <div
              className={` h-8 w-8 justify-center items-center flex rounded-full mt-3 ${
                location.pathname === "/account"
                  ? "bg-primary-50"
                  : "bg-primary-200"
              }`}
            >
              <p className="">{username[0].toString().toUpperCase()}</p>
            </div>
          )}
        </Link>
      </div>
    )
  );
}

export default Header;
