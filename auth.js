const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
};

const authAdmin = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;

        // Check if the user has an admin role
        if (req.user.role !== 'admin') {
            return res.status(403).send('Access Denied: Admins only');
        }

        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
};

module.exports = { auth, authAdmin };

//auth for authenticated users, & authAdmin for admins
// can alternatively try a authRole('') fn as well
