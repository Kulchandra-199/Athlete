const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { jwtSecret } = require('../config');




exports.register = async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) return res.status(400).send('User already registered.');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });

        await user.save();

        const token = jwt.sign({ _id: user._id }, config.jwtSecret);
        res.cookie('token', token, { httpOnly: true });

        res.send('User registered successfully.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Something went wrong.');
    }
};


exports.login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send('Invalid email or password.');

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(400).send('Invalid email or password.');

        const token = jwt.sign({ _id: user._id }, config.jwtSecret);
        res.cookie('token', token, { httpOnly: true });

        res.send('User logged in successfully.');
        console.log(jwtSecret)
    } catch (err) {
        console.error(err);
        res.status(500).send('Something went wrong.');
    }
}

exports.logout = (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, config.jwtSecret, (err, decoded) => {
        if (err) return res.status(401).send('Unauthorized.');
        res.clearCookie('token');
        res.send('User logged out successfully.');
    });
};
