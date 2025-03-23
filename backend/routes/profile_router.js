const express = require('express');
const controller = require("../controllers/profile_controller");
const authorize = require('../middleware/auth');

const router = express.Router();

router.get('/my', authorize('user', 'worker', 'contractor', 'admin') ,controller.getProfile);

router.post('/update',  authorize('user', 'worker', 'contractor', 'admin') , controller.updateProfile);

module.exports = router
