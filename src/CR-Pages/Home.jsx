import React, { useState, useEffect } from "react";
import Navbar from "../CommonComp/Navbar";
import Photo from "../assets/group-photo.png";
import "./Home.css";
import Swal from "sweetalert2";
import LoadingBar from "react-top-loading-bar";
import { db } from "../Firebase";
import { Spin } from "antd";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import Edit from "./ExtraComponents/Std-Edit";
import { MdOutlineDelete } from "react-icons/md";

const Home = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

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

  const handleDeleteField = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This Announcement will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const userPostsCollectionRef = collection(db, "student-info");
          const docRef = doc(userPostsCollectionRef, id); // Reference to the specific document
          await deleteDoc(docRef);
          Swal.fire("Deleted!", "Announcement has been deleted.", "success");
          setStudents((prevPosts) =>
            prevPosts.filter((post) => post.id !== id)
          );
        } catch (error) {
          console.error("Error deleting document:", error);
          Swal.fire(
            "Error",
            "An error occurred while deleting the document.",
            "error"
          );
        }
      }
    });
  };
  return (
    <>
      <LoadingBar
        color="blue"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <Navbar
        attendance={"attendance"}
        announcement={"announcement"}
        classes={"classes"}
        users={"user"}
        material={"material"}
      />
      <div>
        <img src={Photo} alt="group-photo" className="group-photo" />
      </div>
      <div className="att-cont" style={{ marginBottom: "50px" }}>
        <span className="att-head">All Students data</span>
        {loading ? (
          <Spin className="spin" />
        ) : (
          <table className="table">
            <tr className="table-tr">
              <th className="th">Roll Num</th>
              <th className="th">Student Name</th>
              <th className="th">Actions</th>
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
                    <div className="icons">
                      <div className="edit">
                        <Edit
                          id={student.id}
                          name={student.UserName}
                          rollNo={student.RollNo}
                          onUpdate={setStudents}
                        />
                      </div>
                      <div className="delete">
                        <MdOutlineDelete
                          size={20}
                          onClick={() => {
                            handleDeleteField(student.id);
                          }}
                        />
                      </div>
                    </div>
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
      </div>
    </>
  );
};

export default Home;
