const { verifyToken } = require('../utils/jwt');
const Worker = require('../models/Worker');
const Auth = require('../models/Auth');
const User = require('../models/User');

const authMiddleware = (...roles) => async (req, res, next) => {
    // typeof ...roles is array
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({success: false, message: 'Unauthorized: No token' });

    try {
        const decoded = verifyToken(token, process.env.JWT_SECRET || "your_super_secret_key"); //decoded = { id: '123', role: 'admin' }
        req.user = decoded;
        if (decoded.role === 'worker') req.worker = await Worker.findOne({userID: decoded.id});
        if (decoded.role === 'user') req.userClient = await User.findOne({userID: decoded.id});
        // if (decoded.role === 'contractor') req.contractor = await Auth.findById(decoded.id);
        // console.log(req.worker);
        if (roles.length && !roles.includes(decoded.role)) {
            return res.status(403).json({ success: false, message: 'Access Denied' });
        }

        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
};

module.exports = authMiddleware;
