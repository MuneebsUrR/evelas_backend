const express = require("express");
const Service = require("../models/organizer"); // Import the service model
const router = express.Router();
const Event = require("../models/event");

// CREATE a new service
router.post("/services", async (req, res) => {
  try {
    const { organizerId, name, description, pricing, portfolio, socialLinks } = req.body;
    console.log(req.body);

    if (!organizerId || !name) {
      return res.status(400).json({ error: "OrganizerId and Name are required." });
    }

    const newService = new Service({
      organizerId,
      name,
      description,
      pricing,
      portfolio,
      socialLinks,
    });

    await newService.save();
    res.status(201).json(newService);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ all services by organizerId
router.get("/services/:organizerId", async (req, res) => {
  try {
    const { organizerId } = req.params;
    
    const services = await Service.find({ organizerId });
   
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE a service by ID
router.put("/services/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedService = await Service.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedService) {
      return res.status(404).json({ error: "Service not found." });
    }

    res.status(200).json(updatedService);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE a service by ID
router.delete("/services/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedService = await Service.findByIdAndDelete(id);

    if (!deletedService) {
      return res.status(404).json({ error: "Service not found." });
    }

    res.status(200).json({ message: "Service deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ all services (no filter)
router.get("/services", async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Fetch all events for all services of a specific organizer
router.get("/events/:organizerId", async (req, res) => {
  try {
    const { organizerId } = req.params;
    console.log(organizerId);

    // Fetch all services for the organizer
    const services = await Service.find({ organizerId });
    if (!services || services.length === 0) {
      return res.status(404).json({ message: "No services found for this organizer." });
    }
    console.log(services);
    // Get an array of service IDs
    const serviceIds = services.map((service) => service._id);

    // Fetch all events where serviceId is in the list of service IDs
    const events = await Event.find({ organizerId: { $in: serviceIds } }).lean();

    if (!events || events.length === 0) {
      return res.status(404).json({ message: "No events found for these services." });
    }

    // Map service names to events
    const eventsWithServiceNames = events.map((event) => {
      const service = services.find((s) => s._id.toString() === event.organizerId.toString());
      return {
        ...event,
        serviceName: service ? service.name : "Unknown Service", // Add service name to each event
      };
    });
    console.log(eventsWithServiceNames);

    res.status(200).json({ events: eventsWithServiceNames });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Error fetching events." });
  }
});



// Change event isActive status
router.put("/events/:eventId/activate", async (req, res) => {
  try {
    const { eventId } = req.params;
    const { organizerId, isActive } = req.body;

    if (!organizerId) {
      return res.status(400).json({ message: "Organizer ID is required." });
    }

    // Find all services associated with the organizer
    const services = await Service.find({ organizerId });
    if (!services || services.length === 0) {
      return res.status(404).json({ message: "No services found for this organizer." });
    }

    // Get the IDs of all services
    const serviceIds = services.map((service) => service._id);

    // Update the isActive status for the specified event if it's associated with the organizer's services
    const updatedEvent = await Event.findOneAndUpdate(
      { _id: eventId, organizerId: { $in: serviceIds } },
      { isActive },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({
        message: "Event not found or not associated with the organizer's services.",
      });
    }

    res.status(200).json({ message: "Event status updated successfully.", event: updatedEvent });
  } catch (error) {
    console.error("Error updating event status:", error);
    res.status(500).json({ message: "Error updating event status." });
  }
});




// Add feedback for a specific service
router.post("/services/:serviceId/feedback", async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { clientName, rating, comment, response } = req.body;

    if (!clientName || !rating || !comment) {
      return res.status(400).json({ error: "Client name, rating, and comment are required." });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ error: "Service not found." });
    }

    const feedback = {
      clientName,
      rating,
      comment,
      response: response || "",
    };

    service.feedback.push(feedback);
    await service.save();

    res.status(201).json({ message: "Feedback added successfully.", feedback });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all feedback for an organizer's services
router.get("/organizers/:organizerId/feedback", async (req, res) => {
  try {
    const { organizerId } = req.params;

    const services = await Service.find({ organizerId });
    if (!services || services.length === 0) {
      return res.status(404).json({ error: "No services found for this organizer." });
    }

    const feedback = services.flatMap(service => service.feedback);

    res.status(200).json({ organizerId, feedback });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get feedback for a specific service
router.get("/services/:serviceId/feedback", async (req, res) => {
  try {
    const { serviceId } = req.params;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ error: "Service not found." });
    }

    res.status(200).json({ serviceId, feedback: service.feedback });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




module.exports = router;
