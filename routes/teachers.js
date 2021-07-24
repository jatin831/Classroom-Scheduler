const express = require('express');

const router = express.Router();

const teacherController = require('../controllers/teachers');

const isAuth = require('../middlewares/is-auth');

router.get('/teachers', teacherController.getTeachers);

router.post('/addTeacher', isAuth, teacherController.addTeacher);

router.delete('/deleteTeacher', isAuth, teacherController.deleteTeacher);

module.exports = router;