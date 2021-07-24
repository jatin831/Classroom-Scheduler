const express = require('express');
const app = require('../app');

const router = express.Router();

const authController = require('../controllers/auth');

router.post('/login', authController.login);

module.exports = router;