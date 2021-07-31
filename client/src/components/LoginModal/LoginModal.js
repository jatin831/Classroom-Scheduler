import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Backdrop from '../Backdrop/Backdrop';
import { useDispatch } from 'react-redux';
import { LOGIN } from '../../redux/authSlice';

const LoginModal = ({show, closeModal}) => {
    const [closing, setClosing] = useState(false);
    const [email, setEmail] = useState("scheduler@gmail.com");
    const [password, setPassword] = useState("admin_sgsits");

    const dispatch = useDispatch();

    const closeModalUtil = () => {
        setClosing(true);
        setTimeout(() => closeModal(), 300);
    }

    useEffect(() => {
        return () => {
            setClosing(false);
        }
    }, [show])

    const formSubmitHandler = () => {
        dispatch(LOGIN(email, password, closeModalUtil));
    }

    if(!show) return null;

    return (
        <>
            <Backdrop show={show} closeBackdrop={closeModalUtil} />
            <div className={"Modal " + (closing ? "Modal_Close" : "Modal_Show")}>
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Enter Email" className="AddTeacherInp" />
                <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter Password" className="AddTeacherInp" />
                <div className="Modal_Footer">
                    <button onClick={closeModalUtil} className="Modal_CloseBtn">Close</button>
                    <button onClick={formSubmitHandler} type="submit" className="Modal_SaveBtn">Login</button>
                </div>
            </div>
        </>
    )
}

export default LoginModal;
