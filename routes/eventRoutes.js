const express = require('express');
const Event = require('../models/event');
const router = express.Router();

// Create a new event
router.post('/create', async (req, res) => {
 
  try {
    const newEvent = new Event(req.body);
    await newEvent.save();

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: newEvent
    });
  } catch (error) {
    console.log(error);
    
    res.status(400).json({
      success: false,
      error: 'Failed to create event',
      details: error.message
    });
  }
});

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch events',
      details: error.message
    });
  }
});

//fetch by email
router.get('/by-email', async (req, res) => {
  const { email } = req.query; 

  if (!email) {
    return res.status(400).json({
      success: false,
      error: 'Email query parameter is required',
    });
  }

  try {
    // Query based on the nested registration.email field
    const events = await Event.find({ 'registration.email': email }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch events by email',
      details: error.message,
    });
  }
});


// Delete an event by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const eventId = req.params.id;
    const deletedEvent = await Event.findByIdAndDelete(eventId);

    if (!deletedEvent) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
      data: deletedEvent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete event',
      details: error.message
    });
  }
});

module.exports = router;