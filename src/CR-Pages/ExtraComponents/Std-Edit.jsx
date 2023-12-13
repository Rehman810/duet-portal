import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { doc, updateDoc, collection, onSnapshot } from "firebase/firestore";
import { db } from "../../Firebase";
import { CiEdit } from "react-icons/ci";
import { Input } from "antd";

const { TextArea } = Input;
function Edit(props) {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [rollNum, setRollNum] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleEdit = () => {
    setShow(true);
    setName(props.name);
    setRollNum(props.rollNo);
    setId(props.id);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const userPostsCollectionRef = collection(db, "student-info");
    const docRef = doc(userPostsCollectionRef, id);
    try {
      await updateDoc(docRef, {
        UserName: name,
        RollNo: rollNum,
      });
      onSnapshot(docRef, (doc) => {
        props.onUpdate((prevPosts) => {
          const updatedPosts = prevPosts.map((post) =>
            post.id === id ? { ...post, UserName: name, RollNo: rollNum } : post
          );
          return updatedPosts;
        });
        setShow(false);
        console.log("Document field updated successfully!");
      });
    } catch (error) {
      console.error("Error updating document field:", error);
    }
  };
  return (
    <>
      <CiEdit size={20} onClick={handleEdit} />
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlInput1"
            ></Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Students Data</Form.Label>
              <Input
                value={name}
                className="inp"
                placeholder="Edit UserName"
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                value={rollNum}
                className="inp"
                placeholder="Edit Roll Number"
                onChange={(e) => setRollNum(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={(e) => handleSave(e)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Edit;
