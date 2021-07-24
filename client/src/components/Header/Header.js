import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Header.css';

import CalendarLogo from '../../assets/calendarLogo.png';
import { IoMenu } from 'react-icons/io5';
import { IconContext } from "react-icons";
import { BiChevronLeft } from 'react-icons/bi';
import { BiChevronRight } from 'react-icons/bi';
import { shortMonths } from '../utilities';
import LoginModal from '../LoginModal/LoginModal';

import { getFirstLastDayOfWeek, getDateUtil } from '../utilities';
import axios from 'axios';
import { LOGOUT, selectAuthData } from '../../redux/authSlice';
import { useDispatch, useSelector } from 'react-redux';

const formWeekInfoString = (weekInfo) => {
    return shortMonths[weekInfo[0].month] + " " + weekInfo[0].date + ", " + weekInfo[0].year + " – " + shortMonths[weekInfo[1].month] + " " + weekInfo[1].date + ", " + weekInfo[1].year;
}

const Header = ({toggleSidedrawer, currDate, currYear, currMonth, changeDate, view, setView, setTeacherId, setBatch, teachers}) => {

    const [showLogin, setShowLogin] = useState(false);
    const authData = useSelector(selectAuthData);
    const dispatch = useDispatch();

    const increaseDate = () => {
        let newDate = getDateUtil(currYear, currMonth, currDate);
        if(view === "day") {
            newDate = new Date(newDate.getTime() + 24 * 60 * 60 * 1000); 
            changeDate(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
        } else if (view === "week") {
            newDate = new Date(newDate.getTime() + 7 * 24 * 60 * 60 * 1000);
            changeDate(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
        } else if (view === "month") {
            let month = newDate.getMonth();
            let year = newDate.getFullYear();
            if(month === 11) {
                month = 0;
                year += 1;
            } else {
                month += 1;
            }
            changeDate(year, month, 1);
        }
    }

    const decreaseDate = () => {
        let newDate = getDateUtil(currYear, currMonth, currDate);
        if(view === "day") {
            newDate = new Date(newDate.getTime() - 24 * 60 * 60 * 1000); 
            changeDate(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
        } else if (view === "week") {
            newDate = new Date(newDate.getTime() - 7 * 24 * 60 * 60 * 1000);
            changeDate(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
        } else if (view === "month") {
            let month = newDate.getMonth();
            let year = newDate.getFullYear();
            if(month === 0) {
                month = 11;
                year -= 1;
            } else {
                month -= 1;
            }
            changeDate(year, month, newDate.getDate());
        }
    }

    const selectTodayDate = () => {
        let date = new Date();
        changeDate(date.getFullYear(), date.getMonth(), date.getDate());
    }

    let displayDate = shortMonths[currMonth] + " " + currDate + ", " + currYear;
    if(view === "month") {
        displayDate = shortMonths[currMonth] + ", " + currYear;
    } else if (view === "week") {
        let weekInfo = getFirstLastDayOfWeek(currYear, currMonth, currDate);
        displayDate = formWeekInfoString(weekInfo);
    }

    return (
        <>
            <LoginModal show={showLogin} closeModal={() => setShowLogin(false)} />
            <div className="Header_Container">
                <div className="Header">
                    <IconContext.Provider value={{className: "Header_MenuIcon"}}>
                        <IoMenu onClick={toggleSidedrawer} />
                    </IconContext.Provider>
                    <div className="Logo_Container noselect">
                        <img alt="" src={CalendarLogo} />
                    </div>
                    <span className="Header_Title">Classroom Scheduler</span>
                    <div className="Header_SubMenu">
                        <button onClick={selectTodayDate} className="Header_TodayBtn Button_Dark">
                            Today
                        </button>
                        <div className="Header_NavDateBtns">
                            <IconContext.Provider value={{className: "Header_NavDateIcons"}}>
                                <BiChevronLeft onClick={decreaseDate} />
                                <BiChevronRight onClick={increaseDate} />
                            </IconContext.Provider>
                        </div>
                        <span className="Header_SelectedDate">
                            { displayDate }
                        </span>
                    </div>
                    <div className="Header_SelectTeacher">
                        <select onChange={(event) => setTeacherId(event.target.value)} className="Header_Dropdown">
                            <option value={0}>All Teachers</option>
                            {
                                teachers.map(teacher => {
                                    return <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                                })
                            }
                        </select>
                    </div>
                    <div className="Header_SelectBatch">
                        <select onChange={(event) => setBatch(event.target.value)} className="Header_Dropdown">
                            <option value="2021">Batch 2021</option>
                            <option value="2022">Batch 2022</option>
                            <option value="2023">Batch 2023</option>
                            <option value="2024">Batch 2024</option>
                        </select>
                    </div>
                    <div className="Header_SelectView">
                        <select onChange={(event) => setView(event.target.value)} className="Header_Dropdown">
                            <option value="day">Day</option>
                            <option value="week">Week</option>
                            <option value="month">Month</option>
                        </select>
                    </div>
                    <div>
                        {
                            !authData.token ? (
                                <button onClick={() => setShowLogin(true)} className="Header_Login Button_Dark">
                                    Login as Admin
                                </button>
                            ) : (
                                <button onClick={() => dispatch(LOGOUT())} className="Header_Login Button_Dark">
                                    Logout
                                </button>
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header;