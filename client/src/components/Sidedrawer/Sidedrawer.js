import React, { useState, useEffect } from 'react';
import './Sidedrawer.css';
import { IconContext } from "react-icons";
import { BiChevronLeft } from 'react-icons/bi';
import { BiChevronRight } from 'react-icons/bi';
import { GoPlus } from 'react-icons/go';
import { FaTrash } from 'react-icons/fa';
import { shortMonths, getCompleteMonth } from '../utilities';
import DeleteTeacherModal from '../DeleteTeacherModal/DeleteTeacherModal';
import AddTeacherModal from '../AddTeacherModal/AddTeacherModal';

const Sidedrawer = ({show, closeSidedrawer, currYear, currMonth, currDate, changeDate, getTeachers}) => {
    const [selectedYear, setSelectedYear] = useState(currYear);
    const [selectedMonth, setSelectedMonth] = useState(currMonth);
    const [closing, setClosing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    
    const closeSidedrawerUtil = () => {
        setClosing(true);
        setTimeout(() => closeSidedrawer(), 340);
    }

    useEffect(() => {
        setSelectedYear(currYear);
        setSelectedMonth(currMonth);
        setSelectedYear(currYear);
    }, [currYear, currMonth, currDate, changeDate]);

    useEffect(() => {
        if(!show) {
            closeSidedrawerUtil();
        }
        return () => {
            setClosing(false);
        }
    }, [show])

    const increaseMonth = () => {
        let month = selectedMonth + 1;
        if(month === 12) {
            setSelectedYear(prevYear => prevYear + 1);
            setSelectedMonth(0);
        } else {
            setSelectedMonth(month);
        }
    }

    const decreaseMonth = () => {
        let month = selectedMonth - 1;
        if(month === -1) {
            setSelectedYear(prevYear => prevYear - 1);
            setSelectedMonth(11);
        } else {
            setSelectedMonth(month);
        }
    }

    const monthDays = getCompleteMonth(selectedYear, selectedMonth);

    return (
        <>
            <AddTeacherModal getTeachers={getTeachers} show={showModal} closeModal={() => setShowModal(false)}  />
            <DeleteTeacherModal 
                getTeachers={getTeachers} 
                show={showDeleteModal} 
                closeModal={() => setShowDeleteModal(false)}  
            />
            <div className={"Sidedrawer " + (closing ? "Sidedrawer_Close" : (show ? "Sidedrawer_Open" : ""))}>
                <div className="Sidedrawer_Calendar">
                    <div className="Sidedrawer_Header">
                        <IconContext.Provider value={{className: "Sidedrawer_Icons"}}>
                            <BiChevronLeft onClick={decreaseMonth} />
                        </IconContext.Provider>
                        <span className="Sidedrawer_Calendarselected noselect">
                            {shortMonths[selectedMonth]} {selectedYear}
                        </span>
                        <IconContext.Provider value={{className: "Sidedrawer_Icons"}}>
                            <BiChevronRight onClick={increaseMonth} />
                        </IconContext.Provider>
                    </div>
                    <div className="Sidedrawer_Cal">
                        <div className="Sidedrawer_WeekDays">
                            <div>S</div>
                            <div>M</div>
                            <div>T</div>
                            <div>W</div>
                            <div>T</div>
                            <div>F</div>
                            <div>S</div>
                        </div>
                        <div className="Sidedrawer_Days">
                            {
                                monthDays.map((dayNo, index) => {
                                    return (
                                        <div onClick={() => changeDate(selectedYear, selectedMonth, dayNo)} key={index} className={(dayNo === currDate) && (currMonth === selectedMonth) && (currYear === selectedYear) ? "active" : ""}>
                                            {dayNo}
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className="Sidedrawer_AddTeachers">
                        <button onClick={() => setShowModal(true)} className="SidedrawerDarkBtn">
                            <IconContext.Provider value={{className: "Sidedrawer_AddTeachersIcon"}}>
                                <GoPlus />
                            </IconContext.Provider>
                            Add Teacher
                        </button>
                    </div>
                    <div className="Sidedrawer_DeleteTeachers">
                        <button onClick={() => setShowDeleteModal(true)} className="SidedrawerDarkBtn">
                            <IconContext.Provider value={{className: "Sidedrawer_DeleteTeachersIcon"}}>
                                <FaTrash />
                            </IconContext.Provider>
                            Remove Teacher
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Sidedrawer;