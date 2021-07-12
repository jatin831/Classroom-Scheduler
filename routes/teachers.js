const express = require('express');

const router = express.Router();

const teacherController = require('../controllers/teachers');

router.get('/teachers', teacherController.getTeachers);

router.post('/addTeacher', teacherController.addTeacher);

module.exports = router;