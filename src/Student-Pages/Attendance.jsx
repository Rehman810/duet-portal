import React, { useState, useEffect } from "react";
import { db } from "../Firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import Navbar from "../CommonComp/Navbar";
import { Spin } from "antd";

const Attendance = () => {
  const [loading, setLoading] = useState(true);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const uid = localStorage.getItem("uid");
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const attendanceRef = collection(db, "student-info", uid, "attendance");

        const attendanceQuery = query(attendanceRef, orderBy("date", "desc"));

        const querySnapshot = await getDocs(attendanceQuery);

        const records = [];
        querySnapshot.forEach((doc) => {
          records.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        console.log("Attendance Records:", records);
        setAttendanceRecords(records);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching attendance:", error.message);
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  return (
    <div>
      <Navbar
        attendance={"student-attendance"}
        announcement={"student-announcement"}
        home={"/student"}
        material={"student-material"}
      />
      <div className="ind">
        <br />
        <br />
        <span className="ann-head header">Your Attendance Record</span>
        {loading ? (
          <Spin className="spin" />
        ) : (
          <table className="table">
            <tr className="ind-main table-tr">
              <th className="th">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Date</th>
              <th className="th">Attendance&nbsp;&nbsp;&nbsp;</th>
            </tr>
            {attendanceRecords.length > 0 ? (
              attendanceRecords.map((student) => (
                <tr className="ind-main table-tr">
                  <td className="td">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{student.date}
                  </td>
                  <td className="td">
                    {student.isPresent ? "Present" : "Absent"}
                    &nbsp;&nbsp;&nbsp;&nbsp;
                  </td>
                </tr>
              ))
            ) : (
              <div className="no-data-message">
                <p>No attendance data available.</p>
              </div>
            )}
          </table>
        )}
      </div>
    </div>
  );
};

export default Attendance;
