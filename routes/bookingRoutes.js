const express = require('express');
const Booking = require('../models/booking');
const Event = require('../models/event');
const router = express.Router();

// Fetch all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bookings',
      details: error.message,
    });
  }
});

// Fetch bookings by event ID
router.get('/event/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const bookings = await Booking.find({ eventId });
    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bookings for event',
      details: error.message,
    });
  }
});

// Fetch bookings by venue ID
router.get('/venue/:venueId', async (req, res) => {
  try {
    const { venueId } = req.params;
    const bookings = await Booking.find({ venueId });
    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bookings for venue',
      details: error.message,
    });
  }
});

// Fetch bookings by organizer ID
router.get('/organizer/:organizerId', async (req, res) => {
  try {
    const { organizerId } = req.params;
    const bookings = await Booking.find({ organizerId });
    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bookings for organizer',
      details: error.message,
    });
  }
});

// Create a new booking
router.post('/create', async (req, res) => {
  try {
    const {
      organizerId,
      venueId,
      eventId,
      eventName,
      bookingUserName,
      bookingUserEmail,
      bookingUserPhone,
      location,
      price,
      totalTickets,
    } = req.body;
    console.log(req.body)

    // Validate required fields
    if (!eventId || !eventName || !bookingUserName || !bookingUserEmail || !bookingUserPhone || !price || !totalTickets || !location) {
       
        return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }

    const newBooking = new Booking({
      organizerId,
      venueId,
      eventId,
      eventName,
      bookingUserName,
      bookingUserEmail,
      bookingUserPhone,
      location,
      price,
      totalTickets,
      status: 'pending', // Default status
    });

    await newBooking.save();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: newBooking,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      error: 'Failed to create booking',
      details: error.message,
    });
  }
});


// Fetch bookings for user posted events by email
router.get('/by-email', async (req, res) => {
  try {
    const userEmail = req.query.email; // Get email from query parameters

    if (!userEmail) {
      return res.status(400).json({
        success: false,
        error: 'Email is required',
      });
    }

    // Fetch all events posted by the user using the email
    const events = await Event.find({ 'registration.email': userEmail });

    if (events.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No events found for this email',
      });
    }

    // Extract event IDs from the fetched events
    const eventIds = events.map(event => event._id);

    // Fetch bookings for all events using the event IDs
    const bookings = await Booking.find({ eventId: { $in: eventIds } });

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bookings for user\'s events',
      details: error.message,
    });
  }
});

module.exports = router;
