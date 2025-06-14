const Event = require('../models/Event');
const Pass = require('../models/Pass');

// Add a new event
exports.createEvent = async (req, res) => {
  try {
    const { title, location, eventDate, startTime, endTime, passId } = req.body;
    
    // Input validation
    if (!title || !eventDate || !passId) {
      return res.status(400).json({ error: 'Title, event date, and pass ID are required' });
    }
    
    // Check if pass exists
    const pass = await Pass.findById(passId);
    if (!pass) {
      return res.status(404).json({ error: 'Pass not found' });
    }
    
    // Create new event
    const event = new Event({
      title,
      location,
      eventDate: new Date(eventDate),
      startTime,
      endTime,
      passId
    });
    
    const savedEvent = await event.save();
    
    res.status(201).json({
      message: 'Event created successfully',
      eventId: savedEvent._id
    });
  } catch (error) {
    console.error('Error creating event:', error.message);
    res.status(500).json({ error: 'Failed to create event' });
  }
};

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('passId', 'passName')
      .select('title location eventDate startTime endTime');
    
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
    
    res.status(200).json(formattedEvents);
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
      passName: event.passId.passName
    };
    
    res.status(200).json(formattedEvent);
  } catch (error) {
    console.error('Error fetching event:', error.message);
    res.status(500).json({ error: 'Failed to fetch event details' });
  }
};
