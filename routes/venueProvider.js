const express = require("express");
const mongoose = require("mongoose");
const Venue = require("../models/venue");
const Event = require("../models/event");

const router = express.Router();


// Change event isActive status
router.put("/events/:eventId/activate", async (req, res) => {
  try {
    const { eventId } = req.params;
    const { venueProviderId, isActive } = req.body;

    if (!venueProviderId) {
      return res.status(400).json({ message: "Venue provider ID is required." });
    }

    // Find all venues associated with the venue provider
    const venues = await Venue.find({ venueProviderId });
    if (!venues || venues.length === 0) {
      return res.status(404).json({ message: "No venues found for this provider." });
    }

    // Get the IDs of all venues
    const venueIds = venues.map((venue) => venue._id);

    // Update the isActive status for the specified event if it's associated with the provider's venues
    const updatedEvent = await Event.findOneAndUpdate(
      { _id: eventId, venueId: { $in: venueIds } },
      { isActive },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found or not associated with the venue provider's venues." });
    }

    res.status(200).json({ message: "Event status updated successfully.", event: updatedEvent });
  } catch (error) {
    console.error("Error updating event status:", error);
    res.status(500).json({ message: "Error updating event status." });
  }
});


// Fetch all venues for a specific venue provider
router.get("/venues/:venueProviderId", async (req, res) => {
  try {
    const { venueProviderId } = req.params;
    const venues = await Venue.find({ venueProviderId });

    if (!venues || venues.length === 0) {
      return res.status(404).json({ message: "No venues found for this provider." });
    }

    res.status(200).json({ venues });
  } catch (error) {
    console.error("Error fetching venues by provider:", error);
    res.status(500).json({ message: "Error fetching venues." });
  }
});

// Delete a venue for a specific venue provider
router.delete("/venues/:venueId", async (req, res) => {
    try {
      const { venueId } = req.params;
      const venueProviderId = req.body.venueProviderId; 
  
      // Check if the venue provider is the owner of the venue
      const venue = await Venue.findById(venueId);
      if (!venue) {
        return res.status(404).json({ message: "Venue not found." });
      }
  
      if (venue.venueProviderId.toString() !== venueProviderId) {
        return res.status(403).json({ message: "You are not authorized to delete this venue." });
      }
  
      // Delete the venue
      await Venue.findByIdAndDelete(venueId);
      res.status(200).json({ message: "Venue deleted successfully." });
    } catch (error) {
      console.error("Error deleting venue:", error);
      res.status(500).json({ message: "Error deleting venue." });
    }
  });


// Fetch all events for all venues of a specific venue provider
router.get("/events/:venueProviderId", async (req, res) => {
  try {
    const { venueProviderId } = req.params;

    // Fetch all venues for the provider
    const venues = await Venue.find({ venueProviderId });
    if (!venues || venues.length === 0) {
      return res.status(404).json({ message: "No venues found for this provider." });
    }

    // Get an array of venue IDs
    const venueIds = venues.map((venue) => venue._id);

    // Fetch all events where venueId is in the list of venue IDs
    const events = await Event.find({ venueId: { $in: venueIds } }).lean();

    if (!events || events.length === 0) {
      return res.status(404).json({ message: "No events found for these venues." });
    }

    // Map venue names to events
    const eventsWithVenueNames = events.map((event) => {
      const venue = venues.find((v) => v._id.toString() === event.venueId.toString());
      return {
        ...event,
        venueName: venue ? venue.name : "Unknown Venue", // Add venue name to each event
      };
    });

    res.status(200).json({ events: eventsWithVenueNames });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Error fetching events." });
  }
});

  

// Fetch all venues (general listing)
router.get("/venues", async (req, res) => {
  try {
    const venues = await Venue.find();

    if (!venues || venues.length === 0) {
      return res.status(404).json({ message: "No venues found." });
    }

    res.status(200).json({ venues });
  } catch (error) {
    console.error("Error fetching venues:", error);
    res.status(500).json({ message: "Error fetching venues." });
  }
});

// Create a new venue for a specific venue provider
router.post("/venues/create", async (req, res) => {
  try {
    const { venueProviderId, name, address, country, capacity, pricing,imgUrl } = req.body;

    if (!venueProviderId) {
      return res.status(400).json({ message: "Venue provider ID is required." });
    }

    const newVenue = new Venue({
      venueProviderId: new mongoose.Types.ObjectId(venueProviderId), // Ensures it's stored as ObjectId
      name,
      address,
      country,
      capacity, 
      pricing,
      imgUrl
    });

    const savedVenue = await newVenue.save();
    res.status(201).json({ message: "Venue created successfully.", venue: savedVenue });
  } catch (error) {
    console.error("Error creating venue:", error);
    res.status(500).json({ message: "Error creating venue." });
  }
});


// Calculate total earnings for a venue provider
router.get("/earnings/:venueProviderId", async (req, res) => {
  try {
    const { venueProviderId } = req.params;

    // Fetch all venues owned by the venue provider
    const venues = await Venue.find({ venueProviderId });
    if (!venues || venues.length === 0) {
      return res.status(404).json({ message: "No venues found for this provider." });
    }

    // Extract venue IDs
    const venueIds = venues.map((venue) => venue._id);

    // Fetch all events associated with these venues
    const events = await Event.find({ venueId: { $in: venueIds } });

    if (!events || events.length === 0) {
      return res.status(404).json({ message: "No events found for this provider's venues." });
    }

    // Calculate total earnings by summing up the pricing field for each event
    const totalEarnings = events.reduce((sum, event) => {
      const venue = venues.find((v) => v._id.toString() === event.venueId.toString());
      return sum + (venue ? parseFloat(venue.pricing) : 0);
    }, 0);

    res.status(200).json({
      venueProviderId,
      totalEarnings,
    });
  } catch (error) {
    console.error("Error calculating earnings:", error);
    res.status(500).json({ message: "Error calculating earnings." });
  }
});

module.exports = router;
