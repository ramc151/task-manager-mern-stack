const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(403).json({ message: 'Access Denied' });

    try {
        const verified = jwt.verify(token, 'mynameisram');
        req.user = verified
        next()
    } catch (error) {
        res.status(400).json({ message: 'Invalid Token' })
    }
}

module.exports = authenticate;