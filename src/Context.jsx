import { createContext, useContext, useState } from "react";

const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedRollNo, setSelectedRollNo] = useState(null);

  const setStudentId = (studentId) => {
    setSelectedStudentId(studentId);
  };

  const setRollNo = (rollNo) => {
    setSelectedRollNo(rollNo);
  };

  return (
    <StudentContext.Provider
      value={{
        selectedStudentId,
        setStudentId,
        selectedRollNo,
        setRollNo,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export const useStudentContext = () => {
  return useContext(StudentContext);
};
