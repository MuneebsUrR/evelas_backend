const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const serviceSchema = new Schema({
  organizerId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  name: { type: String, required: true },
  description: { type: String },
  pricing: { type: String },
  portfolio: {
    title: { type: String },
    description: { type: String },
    imageUrl: { type: String },
  },
  socialLinks: {
    website: { type: String },
    facebook: { type: String },
    instagram: { type: String },
    twitter: { type: String },
    linkedin: { type: String },
  },
  feedback: [
    {
      clientName: { type: String },
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String },
      response: { type: String },
    },
  ],
  clientRequests: [
    {
      clientName: { type: String },
      clientEmail: { type: String },
      serviceRequested: { type: String },
      message: { type: String },
      status: {
        type: String,
        enum: ["Pending", "Accepted", "Rejected"],
        default: "Pending",
      },
    },
  ],
  isActive: {
    type: Boolean,
    default: true,
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

// Automatically update the updatedAt field before saving
serviceSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
