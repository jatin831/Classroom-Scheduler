const pool = require('../database/pool');

exports.getSlots = (req, res, next) => {
    pool.getConnection((err, connection) => {
        if(err) {
            const error = new Error("The request was not completed due to an internal error.");
            error.statusCode = 500;
            next(error); // passing the error so that its handled by the error handling middleware
        } else {
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
                        next(err);
                    }
                })
            } else { // if teacherId is 0 then return all teacher's Slot
                connection.query('SELECT * FROM slots WHERE start_time > ? && end_time < ? && batch = ?', [startTimestamp, endTimestamp, params.batch], (err, rows) => {
                    connection.release() // return connection to pool
                    
                    if(!err) {
                        res.send(rows);
                    } else {
                        next(err);
                    }
                })
            }
        }
    })
}

exports.addSlot = (req, res, next) => {
    pool.getConnection((err, connection) => {
        if (err) {
            next(err);
        }
        const params = req.body;
        let startTime = new Date(params.startTime);
        let endTime = new Date(params.endTime);
        connection.query('SELECT * FROM slots WHERE start_time < ? && end_time > ? && teacher_id = ?', [endTime, startTime, params.teacherId], (err, results) => {
            if(err) {
                connection.release();
                console.log(err);
                next(err);
            } else {
                if(results.length !== 0) {
                    connection.release();
                    const error = new Error("Invalid Timeslot!. The timeslots must not overlap for the same teacher");
                    error.statusCode = 422;
                    next(error);
                } else {
                    connection.query('INSERT INTO slots (batch, teacher_id, start_time, end_time) VALUES (?, ?, ?, ?)', [params.batch, params.teacherId, startTime, endTime], (err, results) => {
                        connection.release();
                        if(err) {
                            next(err);
                        } else {
                            res.status(200).send({
                                message: "Timeslot added Successfully !!!"
                            })
                        }
                    })
                    
                }
            }
        })
    })
}

exports.updateSlot = (req, res, next) => {
    pool.getConnection((err, connection) => {
        if (err) {
            next(err);
        }
        const params = req.body;
        let startTime = new Date(params.startTime);
        let endTime = new Date(params.endTime);
        connection.query('SELECT * FROM slots WHERE start_time < ? && end_time > ? && teacher_id = ? && id != ?', [endTime, startTime, params.teacherId, params.slotId], (err, results) => {
            if(err) {
                connection.release();
                next(err);
            } else {
                if(results.length !== 0) {
                    connection.release();
                    const error = new Error("Invalid Timeslot!. The timeslots must not overlap for the same teacher");
                    error.statusCode = 422;
                    next(error);
                } else {
                    connection.query('UPDATE slots SET batch = ?, teacher_id = ?, start_time = ?, end_time = ? WHERE id = ?', [params.batch, params.teacherId, startTime, endTime, params.slotId], (err, results) => {
                        connection.release();
                        if(err) {
                            next(err);
                        } else {
                            res.send({
                                status: 200,
                                message: "Timeslot updated Successfully !!!"
                            })
                        }
                    })
                    
                }
            }
        })
    })
}

exports.deleteSlot = (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) {
            next(err);
        }
        const params = req.body;
        connection.query('DELETE FROM slots WHERE id = ?', [params.slotId], (err, results) => {
            connection.release();
            if(err) {
                next(err);
            } else {
                res.send({
                    message: "Slot Deleted Successfully"
                })
            }
        })
    })
}