import React, { useState } from "react";
import "react-activity/dist/library.css";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

function Report() {
  const [userDropDown, setUserDropdown] = useState(false);
  const [timeDropDown, setTimerDropdown] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [reportData, setReportData] = useState(null);

  const times = ["1_Hour", "24_Hours", "Last_Week", "All_Time"];
  const getUsers = async () => {
    const res = await fetch(`http://localhost:5000/users`);
    return res.json();
  };
  const { data: users, isLoading: isUsersLoading } = useQuery(
    "users",
    getUsers
  );
  const getReport = async () => {
    const res = await fetch(`http://localhost:5000/report`);
    return res.json();
  };
  const { data: report, isLoading: isReportLoading } = useQuery(
    "report",
    getReport
  );
  const generateReport = async () => {
    if (selectedUser === "" || selectedTime === "") {
      alert("Please select a user and a time frame");
      return;
    } else {
      const result = await fetch(
        `http://localhost:5000/usersreport/${selectedUser}/${selectedTime}`
      );
      const data = await result.json();
      setReportData(data);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-start flex-col p-4  bg-primary-200">
      {isReportLoading || isUsersLoading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="flex flex-col justify-center items-center">
            <p className="text-2xl">Loading...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col justify-center items-center w-3/4 bg-primary-50 rounded-lg p-2">
            <p className="text-xl border-b border-black w-48 justify-center items-center text-center">
              Total Data:
            </p>

            <p>Total Notes: {report?.notes}</p>
            <p>Total Users: {report?.users}</p>
            <p>Total Likes: {report?.likes}</p>
            <p>
              Average Likes/Note:{" "}
              {Math.round(
                (parseFloat(report?.likes) / parseFloat(report?.notes)) * 100
              ) / 100}
            </p>
            <p>
              Average Likes/User:{" "}
              {Math.round(
                (parseFloat(report?.likes) / parseFloat(report?.users)) * 100
              ) / 100}
            </p>
          </div>
          <div className="bg-primary-50 justify-center items-center flex flex-col w-3/4 rounded-lg p-2 mt-10">
            <p className="text-xl">Data By Users:</p>

            <div className="w-full flex flex-row justify-between border-t border-l border-r border-black p-1">
              <div className="w-24 flex-col flex">
                <button onClick={() => setUserDropdown(!userDropDown)}>
                  Username
                  {!userDropDown ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
                </button>
                {userDropDown && (
                  <div className="w-full  flex flex-col bg-primary-100 rounded-lg ">
                    {users?.map((user) => (
                      <button
                        onClick={() => setSelectedUser(user.username)}
                        className={`${
                          selectedUser === user.username
                            ? "bg-primary-200"
                            : "bg-primary-50"
                        } text-primary-900 rounded-lg m-1`}
                      >
                        {user.username}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex-col flex">
                <button onClick={() => setTimerDropdown(!timeDropDown)}>
                  Time Frame
                  {!timeDropDown ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
                </button>
                {timeDropDown && (
                  <div className="w-full  flex flex-col bg-primary-100 rounded-lg ">
                    {times?.map((time) => (
                      <button
                        onClick={() => setSelectedTime(time)}
                        className={`${
                          selectedTime === time
                            ? "bg-primary-200"
                            : "bg-primary-50"
                        } text-primary-900 rounded-lg m-1`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <p>Total Notes</p>
                <p className="w-20">{reportData?.notes.length}</p>
              </div>
              <div>
                <p>Total Likes</p>
                <p className="w-20">
                  {reportData?.notes.reduce(
                    (acc, note) => acc + note.likes.length,
                    0
                  )}
                </p>
              </div>
              <div>
                <p>Average Likes/Note</p>
                {reportData && (
                  <p className="w-20">
                    {reportData?.notes.length !== 0 &&
                    reportData?.notes.reduce(
                      (acc, note) => acc + note.likes.length,
                      0
                    ) !== 0
                      ? reportData?.notes.reduce(
                          (acc, note) => acc + note.likes.length,
                          0
                        ) / reportData?.notes.length
                      : 0}
                  </p>
                )}
              </div>
            </div>
            <div className="w-full justify-center items-center flex flex-col">
              {/*users?.map((user) => (
                <div className="flex flex-row justify-between border-t border-l border-r border-black p-1">
                  <p className="w-24">{user.username}</p>
                  <p className="w-20">{user.notes.length}</p>
                  <p className="w-20">
                    {user.notes.reduce(
                      (acc, note) => acc + note.likes.length,
                      0
                    )}
                  </p>
                  <p className="w-20">
                    {user.notes.length !== 0 &&
                    user.notes.reduce(
                      (acc, note) => acc + note.likes.length,
                      0
                    ) !== 0
                      ? user.notes.length /
                        user.notes.reduce(
                          (acc, note) => acc + note.likes.length,
                          0
                        )
                      : 0}
                  </p>
                </div>
                        ))*/}
              <div className="w-full border-b border-black" />
              <button
                onClick={async () => {
                  await generateReport();
                }}
                className="text-primary-50 bg-primary-400 rounded-lg p-2 mt-4"
              >
                Generate
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Report;
