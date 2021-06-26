import React, { useState, useEffect} from 'react';
import Backdrop from '../Backdrop/Backdrop';
import { IconContext } from 'react-icons';
import { GrClose } from 'react-icons/gr';
import './ScheduleModal.css';
import { getTimeStr } from '../utilities';
import axios from 'axios';

const ScheduleModal = ({teachers, show, closeModal, selectedDate, type, currHours, currMinutes, endHours, endMinutes, currTeacherId, currBatch, slotId, getSchedule}) => {
    const [closing, setClosing] = useState(false);
    let chosenDate = selectedDate;
    const [date, setDate] = useState(chosenDate);
    const [startTime, setStartTime] = useState(getTimeStr(currHours, currMinutes));
    const [endTime, setEndTime] = useState(getTimeStr(endHours, endMinutes));
    const [teacherId, setTeacherId] = useState(currTeacherId);
    const [batch, setBatch] = useState(currBatch);

    const closeModalUtil = () => {
        setClosing(true);
        setTimeout(() => closeModal(), 300);
    }

    useEffect(() => {
        return () => {
            setClosing(false);
        }
    }, [show])

    useEffect(() => {
        setTeacherId(currTeacherId);
    }, [currTeacherId])

    useEffect(() => {
        setStartTime(getTimeStr(currHours, currMinutes));
        setEndTime(getTimeStr(endHours, endMinutes));
        setDate(selectedDate);
        setBatch(currBatch);
        setTeacherId(currTeacherId)
    }, [currHours, currMinutes, endHours, endMinutes, selectedDate, currTeacherId, currBatch, type])

    const submitFormHandler = (event) => {
        event.preventDefault();
        if(type === "create") {
            let startT = new Date(date + " " + startTime).getTime();
            let endT = new Date(date + " " + endTime).getTime();

            if(startT > endT) {
                alert("Start time cannot be greater than End time");
                return;
            }
            axios.post("/api/addSlot", {
                startTime: startT,
                endTime: endT,
                batch: batch,
                teacherId: (teacherId !== 0 ? teacherId : teachers[0].id) 
            }).then(res => {
                if(res.data.status === 404) {
                    alert(res.data.errorMessage);
                } else {
                    getSchedule();
                }
            }).catch(err => {
                console.log(err);
            })
        } else if(type === "update") {
            let startT = new Date(date + " " + startTime).getTime();
            let endT = new Date(date + " " + endTime).getTime();

            if(startT > endT) {
                alert("Start time cannot be greater than End time");
                return;
            }
            axios.put("/api/updateSlot", {
                startTime: startT,
                endTime: endT,
                batch: batch,
                teacherId: (teacherId !== 0 ? teacherId : teachers[0].id),
                slotId: slotId 
            }).then(res => {
                if(res.data.status === 404) {
                    alert(res.data.errorMessage);
                } else {
                    getSchedule();
                }
            }).catch(err => {
                console.log(err);
            })
        }
        closeModalUtil();
    }

    const changeEndTime = (event) => {
        setEndTime(event.target.value);
    }

    if(!show) return null;

    return (
        <>
            <Backdrop show={show} closeBackdrop={closeModalUtil} />
            <div className={"Modal " + (closing ? "Modal_Close" : "Modal_Show")}>
                <div className="Form_Head">
                    <IconContext.Provider value={{className: "Form_Close_Button"}}> 
                        <GrClose onClick={closeModalUtil} />
                    </IconContext.Provider>
                </div>
                <form onSubmit={submitFormHandler} className="Schedule_Form">
                    <label for="title" className="Form_Label">Teacher: </label>
                    <select id="title" value={teacherId} onChange={(event) => setTeacherId(event.target.value)} className="Form_Select" name="teacher">
                        {
                            teachers.map(teacher => {
                                return <option value={teacher.id}>{teacher.name}</option>
                            })
                        }
                    </select>
                    <label for="batch" className="Form_Label">Batch: </label>
                    <select id="batch" value={batch} onChange={(event) => setBatch(event.target.value)} className="Form_Select" name="teacher">
                        <option value="2021">2021</option>
                        <option value="2022">2022</option>
                        <option value="2023">2023</option>
                        <option value="2024">2024</option>
                    </select>

                    <label className="Form_Label">Date: </label>
                    <input value={date} onChange={(event) => setDate(event.target.value)} type="date" className="Form_Select"/>

                    <label className="Form_Label">Start Time: </label>
                    <input type="time" value={startTime} onChange={(event) => setStartTime(event.target.value)} className="Form_Select"/>


                    <label className="Form_Label">End Time: </label>
                    <input value={endTime} onChange={changeEndTime} type="time" className="Form_Select"/>

                    <div className="Modal_Footer">
                        <button onClick={closeModalUtil} className="Modal_CloseBtn">Close</button>
                        <button type="submit" className="Modal_SaveBtn">{type === "create" ? "Save" : "Update"}</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default ScheduleModal;