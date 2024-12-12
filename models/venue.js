const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const venueSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  imgUrl:{
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  pricing: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  venueProviderId: {
    type: Schema.Types.ObjectId, 
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
venueSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Venue = mongoose.model("Venue", venueSchema);

module.exports = Venue;
