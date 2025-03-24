const express = require('express');
const controller = require("../controllers/service_controller");
const authorize = require('../middleware/auth');

const router = express.Router();

router.post('/add', authorize('worker'), controller.addService);

router.put('/update/:id', authorize('worker'), controller.updateService);

router.get('/my', authorize('worker'), controller.myServices);

router.get('/all', controller.getService);

router.delete('/delete/:id', authorize('worker', 'admin'), controller.deleteService);

router.get('/search', controller.searchServiceByName);

module.exports = router;