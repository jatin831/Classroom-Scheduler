const pool = require('../database/pool');

exports.getTeachers = (req, res, next) => {
    pool.getConnection((err, connection) => {
        if(err) {
            next(err);
        } else {
            connection.query('SELECT * FROM teachers', (err, rows) => {
                connection.release() // return connection to pool
                if(!err) {
                    res.send(rows);
                } else {
                    next(err);
                }
            })
        }
    })
}

exports.addTeacher = (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) {
            next(err);
        } 
        const params = req.body;
        connection.query('INSERT INTO teachers (name) VALUES (?)', [params.name], (err, results) => {
            connection.release();
            if(err) {
                next(err);
            } else {
                res.send({
                    message: "Teacher Added Successfully"
                })
            }
        })
    })
}

exports.deleteTeacher = (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) {
            next(err);
        } 
        const params = req.body;
        console.log(params);
        connection.query('DELETE FROM teachers WHERE id = ?', [params.id], (err, results) => {
            connection.release();
            if(err) {
                next(err);
            } else {
                res.send({
                    data: "Teacher Deleted Successfully"
                })
            }
        })
    })
}