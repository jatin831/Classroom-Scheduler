import React, { useState, useEffect } from 'react';
import { shortWeeks, getDateUtil, getFirstLastDayOfWeek, getLastDateOfMonth, getCompleteMonth, getDateStr, getTimeAMPM, getFirstDayOfMonth } from '../utilities';
import ScheduleModal from '../ScheduleModal/ScheduleModal';
import { BsTrash } from 'react-icons/bs';
import { FiEdit } from 'react-icons/fi';
import './Schedule.css';
import { IconContext } from 'react-icons';
import axios from 'axios';

const getWeekInfoList = (currYear, currMonth, currDate) => {
    let weekInfo = getFirstLastDayOfWeek(currYear, currMonth, currDate);
    let day = getDateUtil(weekInfo[0].year, weekInfo[0].month, weekInfo[0].date).getDay();
    let date = weekInfo[0].date;
    let month = weekInfo[0].month;
    let year = weekInfo[0].year;
    let weekList = [];
    for(let i=0; i<7; i++) {
        weekList.push({
            day: shortWeeks[day],
            date: date,
            month: month,
            year: year
        })
        day++;
        date++;
        if(day === 7) day = 0;
        if(date === getLastDateOfMonth(year, month) + 1) {
            month++;
            date = 1;
        }
        if(month === 12) {
            year++;
            month = 0;
        }
    }
    return weekList;
}

const getTimings = () => {
    let timings = [];
    timings.push({
        num: 12,
        detail: "AM",
        hours: 0
    });
    for(let i=1; i<12; i++) {
        timings.push({
            num: i,
            detail: "AM",
            hours: i
        });
    }
    timings.push({
        num: 12,
        detail: "PM",
        hours: 12
    });
    for(let i=1; i<12; i++) {
        timings.push({
            num: i,
            detail: "PM",
            hours: i + 12
        });
    }
    return timings;
}

const Schedule = ({currYear, currMonth, currDate, view, batch, teacherId, teachers}) => {
    const [show, setShow] = useState(false);
    const [type, setType] = useState("create");
    const [slotId, setSlotId] = useState(null);
    const [currHours, setCurrHours] = useState(0);
    const [currMinutes, setCurrMinutes] = useState(0);
    const [endHours, setEndHours] = useState(0);
    const [endMinutes, setEndMinutes] = useState(0);
    const [selectedDate, setSelectedDate] = useState(getDateStr(currYear, currMonth, currDate));
    const [selectedTeacherId, setSelectedTeacherId] = useState(teacherId);
    const [scheduleList, setScheduleList] = useState([]);

    useEffect(() => {
        setSelectedTeacherId(teacherId);
    }, [teacherId])

    const getSchedule = () => {
        let startTime;
        let endTime;
        if(view === "day") {
            startTime = getDateUtil(currYear, currMonth, currDate).getTime();
            endTime = startTime + 86399000; // the last second of day
        } else if(view === "week") {
            let weekInfo = getFirstLastDayOfWeek(currYear, currMonth, currDate);
            startTime = getDateUtil(weekInfo[0].year, weekInfo[0].month, weekInfo[0].date).getTime();
            endTime = getDateUtil(weekInfo[1].year, weekInfo[1].month, weekInfo[1].date).getTime() + 86399000;
        } else {
            
            startTime = new Date(currYear + "-" + (currMonth + 1) + "-01").getTime();
            endTime = getDateUtil(currYear, currMonth, getLastDateOfMonth(currYear, currMonth)).getTime();
        }
        axios.post("/api/slots", {
            teacherId: parseInt(teacherId),
            startTime: startTime,
            endTime, endTime,
            batch: batch
        }).then(res => {
            setScheduleList(res.data);
        })
    }

    useEffect(() => {
        getSchedule();
    }, [teacherId, batch, view, currDate, currMonth, currYear, teachers])

    let teachersMap = {};
    teachers.forEach(teacher => {
        teachersMap[teacher.id] = teacher.name
    })

    let date = getDateUtil(currYear, currMonth, currDate);

    const timings = getTimings();
    

    const updateSlot = (event, slotId, startHours, startMinutes, endHours, endMinutes, year, month, date, teachersId) => {
        event.stopPropagation();
        setSelectedDate(getDateStr(year, month, date));
        setType("update");
        setSlotId(slotId);
        setCurrHours(startHours);
        setCurrMinutes(startMinutes);
        setEndHours(endHours);
        setEndMinutes(endMinutes);
        setShow(true)
        setSelectedTeacherId(teachersId);
    }

    const deleteSlot = (event, slotId) => {
        event.stopPropagation();
        axios.delete("/api/deleteSlot", {
            data: {
                slotId: slotId
            }
        }).then(res => {
            if(res.data.status === 404) {
                alert(res.data.errorMessage)
            } else {
                getSchedule();
            }
        }).catch(err => {
            console.log(err);
        })
    }

    const createSlot = (event, hours, year, month, date) => {
        setSlotId(null);
        setSelectedTeacherId(teacherId);
        if(hours === -1) {
            if(event.target.classList.contains('Slot_Month') || event.target.parentElement.parentElement.classList.contains('Slot_Month') || event.target.parentElement.classList.contains('Slot_Options') || date === "")
                return;
            setCurrHours(10);
            setEndHours(12);
            setCurrMinutes(0);
            setEndMinutes(0);
            setSelectedDate(getDateStr(year, month, date));
            setType("create");
            setShow(true);
            return;
        }
        if(event.target.classList.contains('Slot') || event.target.parentElement.classList.contains('Slot') || event.target.parentElement.classList.contains('Slot_Options'))
            return;
        setCurrHours(hours);
        setCurrMinutes(0);
        setSelectedDate(getDateStr(year, month, date));
        setType("create");
        setShow(true);
        if(hours === 23) {
            setEndHours(23);
            setEndMinutes(59)
        } else {
            setEndHours(hours + 1);
            setEndMinutes(0);
        }
    }

    let weekList = [];
    if(view === "week")
        weekList = getWeekInfoList(currYear, currMonth, currDate);

    let displayOutput = null;

    if(view === "month") {
        let monthList = getCompleteMonth(currYear, currMonth);
        let totalRows = Math.floor((monthList.length + 6) / 7);
        displayOutput =  (
            <>
                <div className="Schedule_Month">
                    <ul className="Schedule_Header">
                        {
                            shortWeeks.map(week => {
                                return <li className="Schedule_Cell Light_BorderB Light_BorderR">{week}</li>
                            })
                        }
                    </ul>
                    <div style={{gridTemplateRows: ("repeat(" + totalRows + ", 1fr)")}} className="Schedule_DayList">
                        {
                            
                            monthList.map(day => {
                                let slots = [];
                                scheduleList.forEach(slot => {
                                    let startTime = new Date(slot.start_time);
                                    if( startTime.getFullYear() === currYear && 
                                        startTime.getMonth() === currMonth &&
                                        startTime.getDate() === day &&
                                        slot.batch === batch) {
                                        slots.push(slot); 
                                    }
                                })
                                return (
                                    <div onClick={(event) => createSlot(event, -1, currYear, currMonth, day)} className="Schedule_Div Light_BorderB Light_BorderR">
                                        <div className="Schedule_CalendarDate">{day}</div>
                                        <ul className="Schedule_MonthList">
                                            {
                                                slots.map(slot => {
                                                    let startT = new Date(slot.start_time);
                                                    let endT = new Date(slot.end_time);
                                                    return <li className="Slot_Month">
                                                        <div>
                                                            <div className="SlotM_Options">
                                                                <IconContext.Provider value={{className: "Slot_Update"}}>
                                                                    <FiEdit onClick={(event) => updateSlot(event, slot.id, startT.getHours(), startT.getMinutes(), endT.getHours(), endT.getMinutes(), currYear, currMonth, day, slot.teacher_id)}/>
                                                                </IconContext.Provider>
                                                                <IconContext.Provider value={{className: "Slot_Delete"}}>
                                                                    <BsTrash onClick={(event) => deleteSlot(event, slot.id)} />
                                                                </IconContext.Provider>
                                                            </div>
                                                            <h3 className="SlotM_Teacher">{teachersMap[slot.teacher_id]}</h3>
                                                            <span className="SlotM_Time">{getTimeAMPM(startT.getHours(), startT.getMinutes())} to {getTimeAMPM(endT.getHours(), endT.getMinutes())}</span>
                                                        </div>
                                                    </li>
                                                })
                                            }
                                        </ul>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </>
        )
    } else {
        displayOutput =  (
            <>
                <div className="Schedule_Timings ">
                    <div className="Schedule_Field Light_BorderB Light_BorderR">
                        <h5>GMT + 05:30</h5>
                    </div>
                    <ul className="Light_BorderR">
                        {
                            timings.map(time => {
                                return <li className="Schedule_Timing_Cell Light_BorderB">{time.num + " " + time.detail}</li>;
                            })
                        }
                    </ul>
                </div>
                <div className="Schedule_Table">
                    {
                        view === "day" ? (
                            <div className="Schedule_Day">
                                <div className="Schedule_Field Light_BorderB">
                                    <h2>{currDate}</h2>  <h3>{shortWeeks[date.getDay()]}</h3>
                                </div>
                                <ul>
                                    {
                                        timings.map(time => {
                                            let classes = [];

                                            scheduleList.forEach(slot => {
                                                let startTime = new Date(slot.start_time);
                                                if(startTime.getHours() === time.hours && 
                                                    startTime.getFullYear() === currYear && 
                                                    startTime.getMonth() === currMonth &&
                                                    startTime.getDate() === currDate &&
                                                    slot.batch === batch) {
                                                    classes.push(slot); 
                                                }
                                            })
                                            
                                            return <li className="Schedule_Cell Light_BorderB" onClick={(event) => createSlot(event, time.hours, currYear, currMonth, currDate)}>
                                                {
                                                    classes.map(slot => {
                                                        let startTime = new Date(slot.start_time);
                                                        let startT = getTimeAMPM(startTime.getHours(), startTime.getMinutes());
                                                        
                                                        let endTime = new Date(slot.end_time);
                                                        let endT = getTimeAMPM(endTime.getHours(), endTime.getMinutes());
                                                        
                                                        return <div className="Slot">
                                                            <div className="Slot_Options">
                                                                <IconContext.Provider value={{className: "Slot_Update"}}>
                                                                    <FiEdit onClick={(event) => updateSlot(event, slot.id, startTime.getHours(), startTime.getMinutes(), endTime.getHours(), endTime.getMinutes(), currYear, currMonth, currDate, slot.teacher_id)}/>
                                                                </IconContext.Provider>
                                                                <IconContext.Provider value={{className: "Slot_Delete"}}>
                                                                    <BsTrash onClick={(event) => deleteSlot(event, slot.id)} />
                                                                </IconContext.Provider>
                                                            </div>
                                                            <p className="Slot_Title">{teachersMap[slot.teacher_id]}</p>
                                                            <p className="Slot_Timings">{startT} to {endT}</p>
                                                        </div>
                                                    })
                                                }
                                            </li>;
                                        })
                                    }
                                </ul>
                            </div>
                        ) : weekList.map(week => {
                                return (
                                    <div className="Schedule_Week">
                                        <div className="Schedule_Field Light_BorderB Light_BorderR">
                                            <h2>{week.date}</h2>  <h3>{week.day}</h3>
                                        </div>
                                        <ul>
                                            {
                                                timings.map(time => {
                                                    let classes = [];

                                                    scheduleList.forEach(slot => {
                                                        let startTime = new Date(slot.start_time);
                                                        if(startTime.getHours() === time.hours && 
                                                            startTime.getFullYear() === week.year && 
                                                            startTime.getMonth() === week.month &&
                                                            startTime.getDate() === week.date &&
                                                            slot.batch === batch) {
                                                            classes.push(slot); 
                                                        }
                                                    })

                                                    return <li
                                                    onClick={(event) => createSlot(event, time.hours, week.year, week.month, week.date)} 
                                                    className="Schedule_Cell_Week Light_BorderB Light_BorderR">
                                                        {
                                                            classes.map(slot => {
                                                                let startTime = new Date(slot.start_time);
                                                                let startT = getTimeAMPM(startTime.getHours(), startTime.getMinutes());
                                                                
                                                                let endTime = new Date(slot.end_time);
                                                                let endT = getTimeAMPM(endTime.getHours(), endTime.getMinutes());

                                                                return <div className="Slot">
                                                                    <div className="Slot_Options">
                                                                        <IconContext.Provider value={{className: "Slot_Update"}}>
                                                                            <FiEdit onClick={(event) => updateSlot(event, slot.id, startTime.getHours(), startTime.getMinutes(), endTime.getHours(), endTime.getMinutes(), week.year, week.month, week.date, slot.teacher_id)}/>
                                                                        </IconContext.Provider>
                                                                        <IconContext.Provider value={{className: "Slot_Delete"}}>
                                                                            <BsTrash onClick={() => deleteSlot(slot.id)} />
                                                                        </IconContext.Provider>
                                                                    </div>
                                                                    <p className="Slot_Title">{teachersMap[slot.teacher_id]}</p>
                                                                    <p className="Slot_Timings">{startT} to {endT}</p>
                                                                </div>
                                                            })
                                                        }
                                                    </li>;
                                                })
                                            }
                                        </ul>
                                    </div>
                                )
                        })
                    }
                </div>
            </>
        )
    }

    return (
        <>
            <ScheduleModal 
                currHours={currHours}
                currMinutes={currMinutes}
                endHours={endHours}
                endMinutes={endMinutes}
                show={show} 
                type={type} 
                slotId={slotId} 
                selectedDate={selectedDate}
                currBatch={batch}
                currTeacherId={selectedTeacherId}
                teachers={teachers}
                getSchedule={getSchedule}
                closeModal={() => setShow(false)} 
            />
            <div className="Schedule">
                {displayOutput}
            </div>
        </>
    )

}

export default Schedule;