import React, { useState, useEffect } from "react";
import Navbar from "../CommonComp/Navbar";
import { db, auth } from "../Firebase";
import {
  serverTimestamp,
  collection,
  addDoc,
  getDocs,
} from "firebase/firestore";
import "./Attendance.css";
import { Switch, Space, Button, Spin } from "antd";
import Swal from "sweetalert2";
import LoadingBar from "react-top-loading-bar";

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [todayDate, setTodayDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];
    setTodayDate(formattedDate);
  }, []);

  useEffect(() => {
    // Fetch students from Firestore
    const fetchStudents = async () => {
      const newData = [];
      const querySnapshot = await getDocs(collection(db, "student-info"));

      querySnapshot.forEach((doc) => {
        newData.push({
          ...doc.data(),
          id: doc.id,
        });
      });
      newData.sort((a, b) => a.RollNo - b.RollNo);
      setStudents(newData);
      setLoading(false);
    };

    fetchStudents();
  }, []);

  const handleAttendanceChange = (studentId, isPresent) => {
    setAttendanceData((prevData) => ({
      ...prevData,
      [studentId]: isPresent,
    }));
  };

  const markAttendance = async () => {
    setProgress(30);
    try {
      if (!todayDate || !attendanceData) {
        console.error("Invalid data for marking attendance.");
        return;
      }

      // Iterate through each student and save attendance
      for (const student of students) {
        const studentAttendance = {
          date: todayDate,
          serverDate: serverTimestamp(),
          isPresent: attendanceData[student.id] || false,
        };

        // Save attendance record in the student's collection
        const studentAttendanceRef = await addDoc(
          collection(db, "student-info", student.id, "attendance"),
          studentAttendance
        );
      }

      // Clear the form after marking attendance
      setAttendanceData({});
      setProgress(100); // Show loading bar with 100% progress
      setTimeout(() => {}, 200);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Attendance has been marked.",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      setProgress(100); // Show loading bar with 100% progress
      setTimeout(() => {}, 200);
      console.error("Error marking attendance:", error.message);
    }
  };

  return (
    <div className="att-main">
      <LoadingBar
        color="blue"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <Navbar
        attendance={"attendance"}
        announcement={"announcement"}
        users={"user"}
        material={"material"}
        home={"/"}
        userRole={"cr"}
      />

      <div className="att-cont">
        <span className="att-head">Attendance</span>
        <div className="att-date">
          <span className="date-head">{`Date: ${todayDate}`}</span>
        </div>
        {loading ? (
          <Spin className="spin" />
        ) : (
          <table className="table">
            <tr className="table-tr">
              <th className="th">Roll Num</th>
              <th className="th">Student Name</th>
              <th className="th">Attendance</th>
            </tr>
            {students.length > 0 ? (
              students.map((student) => (
                <tr className="table-tr">
                  <td className="td">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{student.RollNo}
                  </td>
                  <td className="td">
                    &nbsp;&nbsp;&nbsp;&nbsp;{student.UserName}
                  </td>
                  <td className="td">
                    <Space direction="vertical">
                      <Switch
                        checkedChildren="Present"
                        unCheckedChildren="Absent"
                        checked={attendanceData[student.id] || false}
                        onChange={(checked) =>
                          handleAttendanceChange(student.id, checked)
                        }
                      />
                    </Space>
                  </td>
                </tr>
              ))
            ) : (
              <div className="no-data-message">
                <p>No student data available.</p>
              </div>
            )}
          </table>
        )}
        <div className="mark-att">
          <Button
            type="primary"
            className="register"
            disabled={loading}
            onClick={markAttendance}
          >
            Mark Attendance
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
