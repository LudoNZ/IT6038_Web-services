const jwt = require('jsonwebtoken');
const config = require('config');
const { User, validate } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const _ = require('lodash');

router.post('/', async (req, res) => {
    console.info('Post Users called');
    // First Validate The Request
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // Check if this user already exisits
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        console.info(`user ${user} already exists`);
        return res.status(400).send('That user already exists!');
    } else {
        console.info(`creating user ${user} - ${req.body.email}`)
        // Insert the new user if they do not exist yet
        user = new User(_.pick(req.body, ['name', 'email', 'password']));
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();
        const token = jwt.sign({ _id: user._id }, config.get('PrivateKey'));
        res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
    }
});

module.exports = router;