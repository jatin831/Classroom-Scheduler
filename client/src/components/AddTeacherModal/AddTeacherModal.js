import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddTeacherModal.css';
import Backdrop from '../Backdrop/Backdrop';

const AddTeacherModal = ({show, closeModal}) => {
    const [closing, setClosing] = useState(false);
    const [teacherName, setTeacherName] = useState("");

    const closeModalUtil = () => {
        setClosing(true);
        setTimeout(() => closeModal(), 300);
    }

    useEffect(() => {
        return () => {
            setClosing(false);
        }
    }, [show])

    const formSubmitHandler = (event) => {
        event.preventDefault();
        axios.post("/api/addTeacher", {
            name: teacherName
        }).then(res => {
            console.log(res);
            if(res.data.status === 404) {
                alert(res.data.errorMessage);
            } else {
                console.log(res);
            }
        })
        closeModalUtil();
    }

    if(!show) return null;

    return (
        <>
            <Backdrop show={show} closeBackdrop={closeModalUtil} />
            <div className={"Modal " + (closing ? "Modal_Close" : "Modal_Show")}>
                <form onSubmit={formSubmitHandler}>
                    <input type="text" value={teacherName} onChange={(event) => setTeacherName(event.target.value)} placeholder="Enter Teacher's Name" className="AddTeacherInp" />
                    <div className="Modal_Footer">
                        <button onClick={closeModalUtil} className="Modal_CloseBtn">Close</button>
                        <button type="submit" className="Modal_SaveBtn">Add</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default AddTeacherModal;