const express = require('express');
const controller = require('../controllers/auth_controller')
const authorize = require('../middleware/auth');

const router = express.Router();

// router.post('/register', controller.registerUser);

router.post('/login', controller.login);

router.post('/registerWorker', controller.registerWorker );

router.post('/registerUser', controller.registerUser);

module.exports = router;