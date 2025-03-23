const User = require('../models/User');
const Worker = require('../models/Worker');
const Service = require('../models/Service');

exports.bookService = async (req, res) => {
    try {

        const serviceId = req.params.id;
        const userId = req.userClient._id;
        const worker = await Worker.findOne({ services: serviceId });

        if (!userId || !serviceId || !worker) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        if (!worker) return res.status(404).json({ success: false, message: "Worker not found" });

        const service = await Service.findById(serviceId);
        if (!service) return res.status(404).json({ success: false, message: "Service not found" });

        // Add booking to user's bookings array
        user.bookings.push({
            serviceId,
            workerId: worker._id,
            status: "Pending"
        });

        await user.save();
        res.status(201).json({ success: true, message: "Service booked successfully", booking: user.bookings[user.bookings.length - 1] });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};

exports.myBookings = async (req, res) => {
    const userId = req.userClient._id;
    try {
        const bookings = await User.findById(userId).populate('bookings').select('bookings');
        res.status(200).json({ success: true, bookings, totalBookings: bookings.bookings.length });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
}

exports.cancelBookingStatus = async (req, res) => {
    const bookingId = req.params.id;
    const userId = req.userClient._id;

    try {
        const user = await User.findOne({_id: userId})
        if (!user) return res.status(404).json({ success: false, message: "Booking not found" });

    const booking = user.bookings.find(booking => booking.id === bookingId);
    
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

        booking.status = "Cancelled";
        await user.save();
        res.status(200).json({ success: true, message: "Booking status updated successfully", booking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }

}

exports.deleteBooking = async (req, res) => {
    const bookingId = req.params.id;
    const userId = req.userClient._id;

    try {
        const user = await User.findOne({_id: userId})
        if (!user) return res.status(404).json({ success: false, message: "Booking not found" });

    const booking = user.bookings.find(booking => booking.id === bookingId);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    user.bookings = user.bookings.filter(booking => booking.id !== bookingId);
        await user.save();
        res.status(200).json({ success: true, message: "Booking deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
}


