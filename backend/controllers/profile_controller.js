const Service = require('../models/Service');
const Worker = require('../models/Worker');


exports.updateProfile = async (req, res) => {
    try {   
        const userID = req.user.id;
        const { name, location, address, phone, availability } = req.body;

        if (!name || !location || !address || !phone) return res.status(400).json({ success: false, message: 'Please fill in all fields' });

        const worker = await Worker.create({
            name,
            userID: userID,
            location,
            address,
            phone,
            availability
        })

        res.status(201).json({ success: true, message: 'Profile updated', worker });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

exports.getProfile = async (req, res) => {
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