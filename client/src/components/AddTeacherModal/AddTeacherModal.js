import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddTeacherModal.css';
import Backdrop from '../Backdrop/Backdrop';
import { selectAuthData } from '../../redux/authSlice';
import { useSelector } from 'react-redux';

const AddTeacherModal = ({show, closeModal, getTeachers}) => {
    const [closing, setClosing] = useState(false);
    const [teacherName, setTeacherName] = useState("");
    const authData = useSelector(selectAuthData);

    let headers = {};
    if (authData.token) {
        headers = {
            Authorization: 'Bearer ' + authData.token
        }
    }

    const closeModalUtil = (event) => {
        event.preventDefault();
        setClosing(true);
        setTimeout(() => closeModal(), 300);
    }

    useEffect(() => {
        setTeacherName("");
        return () => {
            setClosing(false);
        }
    }, [show])

    const formSubmitHandler = (event) => {
        event.preventDefault();
        if(teacherName === "") 
            return;
        axios.post("/api/addTeacher", {
            name: teacherName
        }, 
        {
            headers: headers
        }).then(res => {
            getTeachers();
        })
        .catch(err => {
            if (err.response) {
                alert(err.response.data.message);
            }
        })
        closeModalUtil(event);
    }

    if(!show) return null;

    return (
        <>
            <Backdrop show={show} closeBackdrop={closeModalUtil} />
            <div className={"Modal " + (closing ? "Modal_Close" : "Modal_Show")}>
                <form>
                    <input type="text" value={teacherName} onChange={(event) => setTeacherName(event.target.value)} placeholder="Enter Teacher's Name" className="AddTeacherInp" />
                    <div className="Modal_Footer">
                        <button onClick={closeModalUtil} className="Modal_CloseBtn">Close</button>
                        <button onClick={formSubmitHandler} type="submit" className="Modal_SaveBtn">Add</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default AddTeacherModal;