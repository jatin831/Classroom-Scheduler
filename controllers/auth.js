const pool = require('../database/pool');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = (req, res, next) => {
    pool.getConnection((err, connection) => {
        if(err) {
            next(err);
        } else {
            let params = req.body;
            connection.query('SELECT * FROM users WHERE email = ?', [params.email], (err, results) => {
                if (err) {
                    next(err);
                } else {
                    if(results.length === 0) {
                        const err = new Error("Email not Found");
                        err.statusCode = 401;
                        return next(err);
                    }
                    let password = results[0].password;
                    const token = jwt.sign(
                        {
                            email: params.email,
                        }, 
                        'secretKey',
                        { expiresIn: '24h' }
                    );
                    bcrypt.compare(params.password, password).then(isEqual => {
                        if (isEqual) {
                            res.status(200).send({token: token, email: params.email, expireTime: new Date().getTime() + 24 * 60 * 60 * 1000});
                        } else {
                            const err = new Error("Incorrect Password");
                            err.statusCode = 401;
                            next(err);
                        }
                    })
                }
            })
        }
    })
}