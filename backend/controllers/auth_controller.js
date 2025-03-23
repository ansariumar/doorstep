const Auth = require('../models/Auth');
const Worker = require('../models/Worker');
const Service = require('../models/Service');
const User = require('../models/User');

const { generateToken } = require('../utils/jwt');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) { return res.status(400).json({ message: 'Please fill in all fields' }); }

        const user = await Auth.findOne({ email });
        if (!user) { return res.status(400).json({ message: 'User does not exist' }); }
        
        const isMatch = await user.comparePassword(password);
        if (!isMatch) { return res.status(400).json({ message: 'Invalid credentials' }); }

        const token = generateToken(user._id, user.role);

        res.setHeader('set-cookie', `token=${token}; HttpOnly; Max-Age=3600; SameSite=None; Secure`);
        res.status(200).json({ success: true, message: 'User logged in', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

exports.registerUser = async (req, res) => {
    try {
        
        let {name, email, password, phone } = req.body;

        if (!name || !email || !password || !phone)  return res.status(400).json({ message: 'Please fill in all fields' });  

        const exsistingUser = await Auth.findOne({ email });
        if (exsistingUser) { return res.status(400).json({ message: 'User already exists' }); }

        const authUser = await Auth.create({name, email, password,  role: 'user' });    //creat user for the auth table, this contains the login credentials

        const user = new User({ name, userID: authUser._id, phone });   //creat the same user for the user table, this will be used for everything else otherr than login.

        await user.save();

        const token = generateToken(authUser._id, authUser.role);
        res.status(201).json({ success: true, message: 'User created', token});
    } catch (err) {
        console.error(err);
        res.status(500).json({ success:false, message: 'Server error' });
    }
}


exports.registerWorker = async (req, res) => {
    try {
        const { name, email, password, phone, address, location } = req.body;

        if (!name || !email || !password || !location || !address || !phone )  return res.status(400).json({ message: 'Please fill in all fields' }); 

        const exsistingUser = await Auth.findOne({ email });
        if (exsistingUser) { return res.status(400).json({ message: 'User already exists' }); }

        const user = await Auth.create({name, email, password, role: 'worker' });

        const worker = await Worker.create({ 
            name,
            userID: user._id,
            location,
            address,
            phone
        });

        const token = generateToken(user._id, user.role);
        res.status(201).json({ success: true, message: 'Worker created', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}
