const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(express.json());
app.use(cors())

const slotRoutes = require('./routes/slots');
const teacherRoutes = require('./routes/teachers');
const authRoutes = require('./routes/auth');

app.use('/api', slotRoutes);
app.use('/api', teacherRoutes);
app.use('/api', authRoutes);

// Error Handling
app.use((err, req, res, next) => {
    console.log(err);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).send({message: err.message});
})

if ( process.env.NODE_ENV == "production" || 1) { 
    app.use(express.static("client/build")); 
    const path = require("path"); 
    app.get("*", (req, res) => { 
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')); 
    })
}

module.exports =  app;
