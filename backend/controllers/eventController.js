const Event = require("../models/Event");

const participantFields = "name email";

const populateParticipants = (query) =>
  query.populate("participants", participantFields);

const validateEventBody = (body, isUpdate = false) => {
  const { title, description, location, eventDate, maxParticipants } = body;

  if (!isUpdate) {
    if (!title?.trim() || !description?.trim() || !location?.trim() || !eventDate) {
      return "Title, description, location, and event date are required";
    }
    if (maxParticipants == null || Number(maxParticipants) < 1) {
      return "Max participants must be greater than 0";
    }
  }

  if (title !== undefined && !title.trim()) return "Title cannot be empty";
  if (description !== undefined && !description.trim()) {
    return "Description cannot be empty";
  }
  if (location !== undefined && !location.trim()) return "Location cannot be empty";
  if (eventDate !== undefined && Number.isNaN(new Date(eventDate).getTime())) {
    return "Invalid event date";
  }
  if (maxParticipants !== undefined && Number(maxParticipants) < 1) {
    return "Max participants must be greater than 0";
  }

  return null;
};

const createEvent = async (req, res) => {
  try {
    const error = validateEventBody(req.body);
    if (error) return res.status(400).json({ message: error });

    const event = await Event.create({
      title: req.body.title.trim(),
      description: req.body.description.trim(),
      location: req.body.location.trim(),
      eventDate: new Date(req.body.eventDate),
      maxParticipants: Number(req.body.maxParticipants),
      participants: [],
    });

    const populated = await populateParticipants(Event.findById(event._id));
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getEvents = async (req, res) => {
  try {
    const filter = {};

    if (req.query.upcoming === "true") {
      filter.eventDate = { $gte: new Date() };
    }

    if (req.query.search) {
      const term = req.query.search.trim();
      filter.$or = [
        { title: { $regex: term, $options: "i" } },
        { description: { $regex: term, $options: "i" } },
        { location: { $regex: term, $options: "i" } },
      ];
    }

    const events = await populateParticipants(
      Event.find(filter).sort({ eventDate: 1 })
    );

    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await populateParticipants(Event.findById(req.params.id));

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const error = validateEventBody(req.body, true);
    if (error) return res.status(400).json({ message: error });

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const { title, description, location, eventDate, maxParticipants } = req.body;

    if (title !== undefined) event.title = title.trim();
    if (description !== undefined) event.description = description.trim();
    if (location !== undefined) event.location = location.trim();
    if (eventDate !== undefined) event.eventDate = new Date(eventDate);
    if (maxParticipants !== undefined) {
      const max = Number(maxParticipants);
      if (event.participants.length > max) {
        return res.status(400).json({
          message: "Max participants cannot be less than current registrations",
        });
      }
      event.maxParticipants = max;
    }

    await event.save();
    const populated = await populateParticipants(Event.findById(event._id));
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getParticipants = async (req, res) => {
  try {
    const event = await populateParticipants(Event.findById(req.params.id));

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({
      eventId: event._id,
      title: event.title,
      count: event.participants.length,
      maxParticipants: event.maxParticipants,
      participants: event.participants,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const userId = req.user._id;
    const alreadyRegistered = event.participants.some(
      (p) => String(p) === String(userId)
    );

    if (alreadyRegistered) {
      return res.status(400).json({ message: "Already registered for this event" });
    }

    if (event.participants.length >= event.maxParticipants) {
      return res.status(400).json({ message: "Event is full" });
    }

    event.participants.push(userId);
    await event.save();

    const populated = await populateParticipants(Event.findById(event._id));
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const cancelRegistration = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const userId = req.user._id;
    const index = event.participants.findIndex(
      (p) => String(p) === String(userId)
    );

    if (index === -1) {
      return res.status(400).json({ message: "You are not registered for this event" });
    }

    event.participants.splice(index, 1);
    await event.save();

    const populated = await populateParticipants(Event.findById(event._id));
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createEvent,
  updateEvent,
  deleteEvent,
  getParticipants,
  getEvents,
  getEventById,
  registerForEvent,
  cancelRegistration,
};
