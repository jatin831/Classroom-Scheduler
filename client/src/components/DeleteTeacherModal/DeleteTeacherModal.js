import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DeleteTeacherModal.css';
import Backdrop from '../Backdrop/Backdrop';
import { selectAuthData } from '../../redux/authSlice';
import { useSelector } from 'react-redux';

const DeleteTeacherModal = ({show, closeModal, getTeachers}) => {
    const [closing, setClosing] = useState(false);
    const [teacherId, setTeacherId] = useState(null);
    const [teachers, setTeachers] = useState([]);
    const authData = useSelector(selectAuthData);

    useEffect(() => {
        axios.get('/api/teachers')
        .then(res => {
            setTeachers(res.data);
            if(res.data.length !== 0) {
                setTeacherId(res.data[0].id);
            }
        })
        .catch(err => {
            console.log(err);
        })
    }, [show])

    let headers = {};
    if (authData.token) {
        headers = {
            Authorization: 'Bearer ' + authData.token
        }
    }

    const closeModalUtil = (event) => {
        event.preventDefault();
        setClosing(true);
        setTimeout(() => closeModal(), 250);
    }

    useEffect(() => {
        return () => {
            setClosing(false);
        }
    }, [show])

    const formSubmitHandler = (event) => {
        event.preventDefault();
        if(!teacherId) 
            return;
        axios.delete("/api/deleteTeacher", {
            headers: headers,
            data: {
                id: teacherId
            }
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
                <div className="Modal_Footer Display_Flex_Column">
                    {
                        teachers.length === 0 ? (
                            <div>Teachers list is empty.</div>
                        ) : (
                            <select 
                                value={teacherId} 
                                onChange={(event) => setTeacherId(event.target.value)} 
                                className="Modal_Dropdown"
                            >
                                {
                                    teachers.map((teacher) => {
                                        return <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                                    })
                                }
                            </select>
                        )
                    }
                        
                    <button onClick={formSubmitHandler} type="submit" className="Modal_CloseBtn MT_2">Remove</button>
                </div>
            </div>
        </>
    )
}

export default DeleteTeacherModal;