const mysql = require('mysql2');

const pool = mysql.createPool({
    connectionLimit     : 5,
    host                : 'bxjk335sley77gqee21r-mysql.services.clever-cloud.com',
    user                : 'un8cfhvh7kyxkggm',
    password            : 'SmKx9AgcZGuQgrSYiF73',
    database            : 'bxjk335sley77gqee21r'
})

module.exports = pool;