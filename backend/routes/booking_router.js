const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking_controller');
const authorize = require('../middleware/auth');



router.post('/book/:id', authorize('user'), bookingController.bookService);
router.get('/my-bookings', authorize('user'), bookingController.myBookings);
router.put('/cancel/:id', authorize('user'), bookingController.cancelBookingStatus);

router.delete('/delete/:id', authorize('user'), bookingController.deleteBooking);
module.exports = router;
