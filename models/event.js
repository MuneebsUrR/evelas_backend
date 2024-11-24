const mongoose = require('mongoose');

// Define the schema
const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  isOnline: {
    type: Boolean,
    required: true,
  },
  zipCode: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  banner: {
    type: String, // Assuming you'll store the file path or URL
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  registrationEmailOrURL: {
    type: String,
    required: true,
  },
  videoURL: {
    type: String,
    required: false, // Optional
  },
  startDate: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  ticketType: {
    type: String,
    required: true,
  },
  registrationDeadline: {
    type: Date,
    required: false, // Optional
  },
  organizer: {
    type: String,
    required: false, // Optional
  },
  venue: {
    type: String,
    required: false, // Optional
  },
}, { timestamps: true });

// Create the model
const Event = mongoose.model('Event', EventSchema);

module.exports = Event;
