const express = require('express');
const controller = require("../controllers/profile_controller");
const authorize = require('../middleware/auth');

const router = express.Router();

router.get('/my', authorize('worker') ,controller.getWorkerProfile);
router.get('/my-user', authorize('user') ,controller.getUserProfile);

router.post('/update',  authorize('user', 'worker', 'contractor', 'admin') , controller.updateProfile);

module.exports = router
