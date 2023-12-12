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
  const [text, setText] = useState();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleEdit = () => {
    setShow(true);
    setId(props.id);
    setText(props.text);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const userPostsCollectionRef = collection(db, "announcement");
    const docRef = doc(userPostsCollectionRef, id);
    try {
      await updateDoc(docRef, {
        text: text,
      });
      onSnapshot(docRef, (doc) => {
        props.onUpdate((prevPosts) => {
          const updatedPosts = prevPosts.map((post) =>
            post.id === id ? { ...post, text: text } : post
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
              <Form.Label>Announcement</Form.Label>

              <TextArea
                className="textarea"
                value={text}
                autoFocus
                placeholder="Edit your announcement here."
                onChange={(e) => setText(e.target.value)}
                autoSize={{
                  minRows: 3,
                  maxRows: 5,
                }}
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
