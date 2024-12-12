const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new mongoose.Schema(
    {
        organizerId: {
            type: Schema.Types.ObjectId,
            required: false
        },
        venueId: {
            type: Schema.Types.ObjectId,
            required: false
        },
        eventId: {
            type: Schema.Types.ObjectId,
            required: true,
        },

        eventName: {
            type: String,
            required: true,
        },
        bookingUserName: {
            type: String,
            required: true,
        },
        bookingUserEmail: {
            type: String,
            required: true,
        },
        bookingUserPhone: {
            type: String,
            required: true,
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
        price: {
            type: String,
            required: true,
        },
        totalTickets: {
            type:String,
            required:true

        },
        bookingDate: {
            type: Date,
            default: Date.now,
        },
        status: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
