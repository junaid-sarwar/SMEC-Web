// Modified controllers/eventController.js to work with MongoDB
const Event = require('../models/Event'); // You'll need to create this model
const Pass = require('../models/Pass'); // You'll need to create this model

// Add a new event
exports.createEvent = async (req, res) => {
  try {
    const { title, location, eventDate, startTime, endTime, passId } = req.body;
    
    // Input validation
    if (!title || !eventDate || !passId) {
      return res.status(400).json({ error: 'Title, event date, and pass ID are required' });
    }
    
    // Check if pass exists
    const passExists = await Pass.findById(passId);
    
    if (!passExists) {
      return res.status(404).json({ error: 'Pass not found' });
    }
    
    // Create new event
    const newEvent = new Event({
      title,
      location,
      eventDate: new Date(eventDate),
      startTime,
      endTime,
      passId
    });
    
    const savedEvent = await newEvent.save();
    
    res.status(201).json({
      message: 'Event created successfully',
      eventId: savedEvent._id
    });
  } catch (error) {
    console.error('Error creating event:', error.message);
    
    // Handle MongoDB validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }
    
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid pass ID format' });
    }
    
    res.status(500).json({ error: 'Failed to create event' });
  }
};

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    // Get all events and populate pass information
    const events = await Event.find({})
      .populate('passId', 'passName')
      .sort({ eventDate: 1 }); // Sort by event date
    
    const formattedEvents = events.map(event => ({
      id: event._id,
      title: event.title,
      location: event.location,
      eventDate: event.eventDate,
      startTime: event.startTime,
      endTime: event.endTime,
      passId: event.passId._id,
      passName: event.passId.passName
    }));
    
    res.status(200).json({
      message: 'Events retrieved successfully',
      count: events.length,
      events: formattedEvents
    });
  } catch (error) {
    console.error('Error fetching events:', error.message);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

// Get event by ID
exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const event = await Event.findById(id)
      .populate('passId', 'passName');
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    const formattedEvent = {
      id: event._id,
      title: event.title,
      location: event.location,
      eventDate: event.eventDate,
      startTime: event.startTime,
      endTime: event.endTime,
      passId: event.passId._id,
      passName: event.passId.passName,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt
    };
    
    res.status(200).json({
      message: 'Event retrieved successfully',
      event: formattedEvent
    });
  } catch (error) {
    console.error('Error fetching event:', error.message);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid event ID format' });
    }
    
    res.status(500).json({ error: 'Failed to fetch event details' });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, location, eventDate, startTime, endTime, passId } = req.body;
    
    // If passId is being updated, check if it exists
    if (passId) {
      const passExists = await Pass.findById(passId);
      if (!passExists) {
        return res.status(404).json({ error: 'Pass not found' });
      }
    }
    
    const updateData = {};
    if (title) updateData.title = title;
    if (location !== undefined) updateData.location = location;
    if (eventDate) updateData.eventDate = new Date(eventDate);
    if (startTime !== undefined) updateData.startTime = startTime;
    if (endTime !== undefined) updateData.endTime = endTime;
    if (passId) updateData.passId = passId;
    
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('passId', 'passName');
    
    if (!updatedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.status(200).json({
      message: 'Event updated successfully',
      event: {
        id: updatedEvent._id,
        title: updatedEvent.title,
        location: updatedEvent.location,
        eventDate: updatedEvent.eventDate,
        startTime: updatedEvent.startTime,
        endTime: updatedEvent.endTime,
        passId: updatedEvent.passId._id,
        passName: updatedEvent.passId.passName
      }
    });
  } catch (error) {
    console.error('Error updating event:', error.message);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }
    
    res.status(500).json({ error: 'Failed to update event' });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedEvent = await Event.findByIdAndDelete(id);
    
    if (!deletedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.status(200).json({
      message: 'Event deleted successfully',
      eventId: deletedEvent._id
    });
  } catch (error) {
    console.error('Error deleting event:', error.message);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid event ID format' });
    }
    
    res.status(500).json({ error: 'Failed to delete event' });
  }
};

// Get events by pass ID
exports.getEventsByPassId = async (req, res) => {
  try {
    const { passId } = req.params;
    
    // Check if pass exists
    const passExists = await Pass.findById(passId);
    if (!passExists) {
      return res.status(404).json({ error: 'Pass not found' });
    }
    
    const events = await Event.find({ passId })
      .populate('passId', 'passName')
      .sort({ eventDate: 1 });
    
    res.status(200).json({
      message: 'Events retrieved successfully',
      count: events.length,
      events: events.map(event => ({
        id: event._id,
        title: event.title,
        location: event.location,
        eventDate: event.eventDate,
        startTime: event.startTime,
        endTime: event.endTime,
        passId: event.passId._id,
        passName: event.passId.passName
      }))
    });
  } catch (error) {
    console.error('Error fetching events by pass ID:', error.message);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid pass ID format' });
    }
    
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

// Get upcoming events
exports.getUpcomingEvents = async (req, res) => {
  try {
    const currentDate = new Date();
    
    const events = await Event.find({
      eventDate: { $gte: currentDate }
    })
      .populate('passId', 'passName')
      .sort({ eventDate: 1 })
      .limit(10); // Limit to next 10 events
    
    res.status(200).json({
      message: 'Upcoming events retrieved successfully',
      count: events.length,
      events: events.map(event => ({
        id: event._id,
        title: event.title,
        location: event.location,
        eventDate: event.eventDate,
        startTime: event.startTime,
        endTime: event.endTime,
        passId: event.passId._id,
        passName: event.passId.passName
      }))
    });
  } catch (error) {
    console.error('Error fetching upcoming events:', error.message);
    res.status(500).json({ error: 'Failed to fetch upcoming events' });
  }
};