const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors())

const pool = mysql.createPool({
    connectionLimit     : 5,
    host                : 'bxjk335sley77gqee21r-mysql.services.clever-cloud.com',
    user                : 'un8cfhvh7kyxkggm',
    password            : 'SmKx9AgcZGuQgrSYiF73',
    database            : 'bxjk335sley77gqee21r'
})

app.get('/api/teachers', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) {
            res.send({
                status: 404,
                errorMessage: "The request was not completed due to an internal error."
            })
        } else {
            connection.query('SELECT * FROM teachers', (err, rows) => {
                connection.release() // return connection to pool
    
                if(!err) {
                    res.send(rows);
                } else {
                    res.send({
                        status: 404,
                        errorMessage: "Invalid Request"
                    })
                }
            })
        }
    })
})

app.post('/api/slots', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) {
            res.send({
                status: 404,
                errorMessage: "The request was not completed due to an internal error."
            })
        } else {
            console.log(req.body);
            let params = req.body;
            let startTimestamp = new Date(params.startTime);
            let endTimestamp = new Date(params.endTime);
            console.log(startTimestamp);
            if(params.teacherId !== 0) {
                connection.query('SELECT * FROM slots WHERE start_time > ? && end_time < ? && batch = ? && teacher_id = ? ORDER BY start_time', [startTimestamp, endTimestamp, params.batch, params.teacherId], (err, rows) => {
                    connection.release() // return connection to pool
                    
                    if(!err) {
                        res.send(rows);
                    } else {
                        res.send({
                            status: 404
                        })
                    }
                })
            } else { // if teacherId is 0 then return all teacher's Slot
                connection.query('SELECT * FROM slots WHERE start_time > ? && end_time < ? && batch = ?', [startTimestamp, endTimestamp, params.batch], (err, rows) => {
                    connection.release() // return connection to pool
                    
                    if(!err) {
                        res.send(rows);
                    } else {
                        res.send({
                            status: 404
                        })
                    }
                })
            }
        }
    })
})

app.post('/api/addSlot', (req, res) => {
    pool.getConnection((err, connection) => {
        console.log(err);
        const params = req.body;
        let startTime = new Date(params.startTime);
        let endTime = new Date(params.endTime);
        console.log(startTime, endTime);
        console.log(params);
        connection.query('SELECT * FROM slots WHERE start_time < ? && end_time > ? && teacher_id = ?', [endTime, startTime, params.teacherId], (err, results) => {
            if(err) {
                connection.release();
                res.send({
                    status: 404,
                    errorMessage: "The request was not completed due to an internal error."
                });
                console.log(err);
            } else {
                if(results.length !== 0) {
                    connection.release();
                    res.send({
                        status: 404,
                        errorMessage: "Invalid Timeslot!. The timeslots must not overlap for the same teacher."
                    })
                } else {
                    console.log(params);
                    connection.query('INSERT INTO slots (batch, teacher_id, start_time, end_time) VALUES (?, ?, ?, ?)', [params.batch, params.teacherId, startTime, endTime], (err, results) => {
                        connection.release();
                        if(err) {
                            console.log(err);
                            res.send({
                                status: 404,
                                errorMessage: "Invalid Request"
                            })
                        } else {
                            res.send({
                                status: 200,
                                data: "Timeslot added Successfully !!!"
                            })
                        }
                    })
                    
                }
            }
        })
    })
})

app.put("/api/updateSlot", (req, res) => {
    pool.getConnection((err, connection) => {
        const params = req.body;
        let startTime = new Date(params.startTime);
        let endTime = new Date(params.endTime);
        console.log(params);
        connection.query('SELECT * FROM slots WHERE start_time < ? && end_time > ? && teacher_id = ? && id != ?', [endTime, startTime, params.teacherId, params.slotId], (err, results) => {
            if(err) {
                connection.release();
                res.send({
                    status: 404,
                    errorMessage: "The request was not completed due to an internal error."
                });
                console.log(err);
            } else {
                if(results.length !== 0) {
                    connection.release();
                    console.log(results);
                    res.send({
                        status: 404,
                        errorMessage: "Invalid Timeslot!. The timeslots must not overlap for the same teacher."
                    })
                } else {
                    console.log(params);
                    connection.query('UPDATE slots SET batch = ?, teacher_id = ?, start_time = ?, end_time = ? WHERE id = ?', [params.batch, params.teacherId, startTime, endTime, params.slotId], (err, results) => {
                        connection.release();
                        if(err) {
                            console.log(err);
                            res.send({
                                status: 404,
                                errorMessage: "Invalid Request"
                            })
                        } else {
                            res.send({
                                status: 200,
                                data: "Timeslot updated Successfully !!!"
                            })
                        }
                    })
                    
                }
            }
        })
    })
})

app.delete("/api/deleteSlot", (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) {
            res.send({
                status: 404,
                errorMessage: "Request failed due to an internal error"
            })
        }
        const params = req.body;
        console.log(params);
        connection.query('DELETE FROM slots WHERE id = ?', [params.slotId], (err, results) => {
            connection.release();
            if(err) {
                res.send({
                    status: 404,
                    errorMessage: "Invalid Request"
                })
            } else {
                res.send({
                    status: 200,
                    data: "Slot Deleted Successfully"
                })
            }
        })
    })
})

app.post("/api/addTeacher", (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) {
            res.send({
                status: 404,
                errorMessage: "Request failed due to an internal error"
            })
        } 
        const params = req.body;
        connection.query('INSERT INTO teachers (name) VALUES (?)', [params.name], (err, results) => {
            connection.release();
            if(err) {
                res.send({
                    status: 404,
                    errorMessage: "Invalid Request"
                })
            } else {
                res.send({
                    status: 200,
                    data: "Teacher Added Successfully"
                })
            }
        })
    })
})

app.delete("/api/deleteTeacher", (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) {
            res.send({
                status: 404,
                errorMessage: "Request failed due to an internal error"
            })
        } 
        const params = req.body;
        connection.query('DELETE FROM teachers WHERE id = ?', [params.teacherId], (err, results) => {
            connection.release();
            if(err) {
                res.send({
                    status: 404,
                    errorMessage: "Invalid Request"
                })
            } else {
                res.send({
                    status: 200,
                    data: "Teacher Deleted Successfully"
                })
            }
        })
    })
})

if ( process.env.NODE_ENV == "production" || 1) { 
    app.use(express.static("client/build")); 
    const path = require("path"); app.get("*", (req, res) => { 
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')); 
    })
}

module.exports =  app;
// app.listen(port, () => console.log(`Listening on port http://localhost:${port}/`));