const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();
require('dotenv').config();

// Register a new user
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // Check if the role is valid
        if (!['admin', 'customer', 'event organizer', 'venue provider'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create a new user
        const user = new User({ name, email, password, role });
        await user.save();

        // Generate JWT
        const token = jwt.sign({ id: user._id, role: user.role, email: user.email, isActive:user.isActive }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });

        res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Login a user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare passwords
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign({ id: user._id, role: user.role, email: user.email, isActive:user.isActive }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


// Fetch all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, '-password'); // Exclude passwords from the response
        res.status(200).json({ message: 'Users fetched successfully', users });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Change user isActive status to true
router.patch('/user/:id/activate', async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByIdAndUpdate(id, { isActive: true }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User activated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete a user account
router.delete('/user/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


module.exports = router;
