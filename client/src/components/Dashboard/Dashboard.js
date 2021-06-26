import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { getLastDateOfMonth } from '../utilities';
import Header from '../Header/Header';
import Sidedrawer from '../Sidedrawer/Sidedrawer';
import Schedule from '../Schedule/Schedule';
import axios from 'axios';
import "./Dashboard.css";

const Dashboard = () => {
    const history = useHistory();
    const [view, setView] = useState("day");
    const [showSidedrawer, setShowSidedrawer] = useState(true);
    const params = useParams();
    const [currDate, setCurrDate] = useState(parseInt(params.date));
    const [currMonth, setCurrMonth] = useState(parseInt(params.month) - 1); 
    const [currYear, setCurrYear] = useState(parseInt(params.year)); 
    const [teacherId, setTeacherId] = useState(0);
    const [teachers, setTeachers] = useState([]);
    const [batch, setBatch] = useState("2021");

    if(currMonth < 0 || currMonth > 11 || currDate > getLastDateOfMonth(currYear, currMonth) || currDate < 1 || currYear > 2038 || currYear < 1990) {
        history.push("/");
    }

    const getTeachers = () => {
        axios.get('/api/teachers')
        .then(res => {
            setTeachers(res.data);
        })
        .catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {
        getTeachers();
    }, [])

    const changeDate = (year, month, date) => {
        setCurrDate(date);
        setCurrMonth(month);
        setCurrYear(year);
        history.push("/calendar/" + year + "/" + (month + 1) + "/" + date);
    }

    const toggleSidedrawer = () => {
        setShowSidedrawer(prevState => !prevState);
    }

    return (
        <div className="Container">
            <Header 
                currYear={currYear} 
                currMonth={currMonth} 
                currDate={currDate} 
                changeDate={changeDate} 
                toggleSidedrawer={toggleSidedrawer} 
                view={view}
                setView={setView}
                setTeacherId={setTeacherId}
                setBatch={setBatch}
                teachers={teachers}
            />
            <div className="Main_Content">
                <Sidedrawer 
                    currYear={currYear} 
                    currMonth={currMonth} 
                    currDate={currDate} 
                    getTeachers={getTeachers}
                    changeDate={changeDate} 
                    show={showSidedrawer} 
                    closeSidedrawer={() => {}} 
                />
                <Schedule 
                    currYear={currYear} 
                    currMonth={currMonth} 
                    currDate={currDate} 
                    view={view} 
                    batch={batch}
                    teacherId={teacherId}
                    teachers={teachers}
                />
            </div>
        </div>
    )
}

export default Dashboard;