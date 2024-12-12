const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  eventType: {
    type: String,
    required: true,
  },
  isOnline: {
    type: Boolean,
    required: true
  },
  isActive: { //only active events will be displayed in the web app venue provider can activate/deactivate the event
    type: Boolean,
    default: false
  },
  location: {
    zipCode: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    }
  },
  banner: {
    type: String,  // URL to stored image
    required: false
  },
  description: {
    type: String,
    required: true
  },
  registration: {
    email: {
      type: String,
      required: true
    },
    deadline: {
      type: Date,
      required: false
    }
  },
  videoUrl: {
    type: String,
    required: false
  },
  dates: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    }
  },
  ticketing: {
    type: String,
    required: true,
  },
  organizerId: {
    type: Schema.Types.ObjectId,
    default:null
  },
  venueId: {
    type: Schema.Types.ObjectId,
    default:null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
eventSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;