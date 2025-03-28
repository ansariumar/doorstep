const Service = require('../models/Service');
const Worker = require('../models/Worker');
const User = require('../models/User');

exports.updateProfile = async (req, res) => {
    try {   
        const userID = req.user.id;
        const workerID = req.worker._id;
        const { name, location, address, phone, availability } = req.body;

        // if (!name || !location || !address || !phone) return res.status(400).json({ success: false, message: 'Please fill in all fields' });


        // const worker = await Worker.create({
        //     name,
        //     userID: userID,
        //     location,
        //     address,
        //     phone,
        //     availability
        // })

        const worker  =  await Worker.findById(workerID)
        worker.name = name ?? worker.name;
        worker.location = location ?? worker.location;
        worker.address = address ?? worker.address;
        worker.phone = phone ?? worker.phone;
        worker.availability = availability ?? worker.availability;

        await worker.save();
        
        res.status(201).json({ success: true, message: 'Profile updated', worker });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

exports.getWorkerProfile = async (req, res) => {
    try {
        const userID = req.user.id;
        const worker = await Worker.findOne({ userID }).populate('services');
        if (!worker) return res.status(404).json({ success: false, message: 'Profile not found' });

        res.status(200).json({ success: true, worker });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

exports.getUserProfile = async (req, res) => {
    try {
        const userID = req.user.id;

        const user = await User.findOne({userID: userID}).populate('bookings.serviceId')

        res.status(200).json({ success: true, user })
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

