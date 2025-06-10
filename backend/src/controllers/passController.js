// Modified controllers/passController.js to work with MongoDB
const Pass = require('../models/Pass'); // You'll need to create this model
const Event = require('../models/Event'); // You'll need the Event model

// Add a new pass
exports.createPass = async (req, res) => {
  try {
    const { passName, description, price, passType, validity } = req.body;
    
    // Input validation
    if (!passName || price === undefined) {
      return res.status(400).json({ error: 'Pass name and price are required' });
    }
    
    // Create new pass
    const newPass = new Pass({
      passName,
      description,
      price,
      passType,
      validity
    });
    
    const savedPass = await newPass.save();
    
    res.status(201).json({
      message: 'Pass created successfully',
      passId: savedPass._id
    });
  } catch (error) {
    console.error('Error creating pass:', error.message);
    
    // Handle MongoDB validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Pass with this name already exists' });
    }
    
    res.status(500).json({ error: 'Failed to create pass' });
  }
};

// Get pass details by ID
exports.getPassById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const pass = await Pass.findById(id);
    
    if (!pass) {
      return res.status(404).json({ error: 'Pass not found' });
    }
    
    res.status(200).json({
      message: 'Pass retrieved successfully',
      pass: {
        id: pass._id,
        passName: pass.passName,
        description: pass.description,
        price: pass.price,
        passType: pass.passType,
        validity: pass.validity,
        isActive: pass.isActive,
        createdAt: pass.createdAt,
        updatedAt: pass.updatedAt
      }
    });
  } catch (error) {
    console.error('Error fetching pass:', error.message);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid pass ID format' });
    }
    
    res.status(500).json({ error: 'Failed to fetch pass details' });
  }
};

// Get all events related to a pass
exports.getPassEvents = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if pass exists
    const pass = await Pass.findById(id);
    
    if (!pass) {
      return res.status(404).json({ error: 'Pass not found' });
    }
    
    // Get all events associated with the pass
    const events = await Event.find({ passId: id })
      .select('title location eventDate startTime endTime status')
      .sort({ eventDate: 1 });
    
    const formattedEvents = events.map(event => ({
      id: event._id,
      title: event.title,
      location: event.location,
      eventDate: event.eventDate,
      startTime: event.startTime,
      endTime: event.endTime,
      status: event.status
    }));
    
    res.status(200).json({
      message: 'Pass events retrieved successfully',
      passName: pass.passName,
      eventCount: events.length,
      events: formattedEvents
    });
  } catch (error) {
    console.error('Error fetching pass events:', error.message);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid pass ID format' });
    }
    
    res.status(500).json({ error: 'Failed to fetch pass events' });
  }
};

// Get all passes
exports.getAllPasses = async (req, res) => {
  try {
    const { page = 1, limit = 10, active } = req.query;
    
    // Build query filter
    const filter = {};
    if (active !== undefined) {
      filter.isActive = active === 'true';
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    const passes = await Pass.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const totalCount = await Pass.countDocuments(filter);
    
    res.status(200).json({
      message: 'Passes retrieved successfully',
      count: passes.length,
      totalCount,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCount / limit),
      passes: passes.map(pass => ({
        id: pass._id,
        passName: pass.passName,
        description: pass.description,
        price: pass.price,
        passType: pass.passType,
        validity: pass.validity,
        isActive: pass.isActive,
        createdAt: pass.createdAt
      }))
    });
  } catch (error) {
    console.error('Error fetching passes:', error.message);
    res.status(500).json({ error: 'Failed to fetch passes' });
  }
};

// Update pass
exports.updatePass = async (req, res) => {
  try {
    const { id } = req.params;
    const { passName, description, price, passType, validity, isActive } = req.body;
    
    const updateData = {};
    if (passName) updateData.passName = passName;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (passType) updateData.passType = passType;
    if (validity !== undefined) updateData.validity = validity;
    if (isActive !== undefined) updateData.isActive = isActive;
    
    const updatedPass = await Pass.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedPass) {
      return res.status(404).json({ error: 'Pass not found' });
    }
    
    res.status(200).json({
      message: 'Pass updated successfully',
      pass: {
        id: updatedPass._id,
        passName: updatedPass.passName,
        description: updatedPass.description,
        price: updatedPass.price,
        passType: updatedPass.passType,
        validity: updatedPass.validity,
        isActive: updatedPass.isActive,
        updatedAt: updatedPass.updatedAt
      }
    });
  } catch (error) {
    console.error('Error updating pass:', error.message);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid pass ID format' });
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }
    
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Pass name already exists' });
    }
    
    res.status(500).json({ error: 'Failed to update pass' });
  }
};

// Delete pass
exports.deletePass = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if there are any events associated with this pass
    const eventCount = await Event.countDocuments({ passId: id });
    
    if (eventCount > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete pass with associated events',
        message: `This pass has ${eventCount} associated events. Please delete or reassign them first.`
      });
    }
    
    const deletedPass = await Pass.findByIdAndDelete(id);
    
    if (!deletedPass) {
      return res.status(404).json({ error: 'Pass not found' });
    }
    
    res.status(200).json({
      message: 'Pass deleted successfully',
      passId: deletedPass._id
    });
  } catch (error) {
    console.error('Error deleting pass:', error.message);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid pass ID format' });
    }
    
    res.status(500).json({ error: 'Failed to delete pass' });
  }
};

// Get pass statistics
exports.getPassStats = async (req, res) => {
  try {
    const { id } = req.params;
    
    const pass = await Pass.findById(id);
    
    if (!pass) {
      return res.status(404).json({ error: 'Pass not found' });
    }
    
    // Get event statistics
    const totalEvents = await Event.countDocuments({ passId: id });
    const upcomingEvents = await Event.countDocuments({
      passId: id,
      eventDate: { $gte: new Date() }
    });
    const completedEvents = await Event.countDocuments({
      passId: id,
      status: 'completed'
    });
    
    res.status(200).json({
      message: 'Pass statistics retrieved successfully',
      passId: id,
      passName: pass.passName,
      statistics: {
        totalEvents,
        upcomingEvents,
        completedEvents,
        pastEvents: totalEvents - upcomingEvents
      }
    });
  } catch (error) {
    console.error('Error fetching pass statistics:', error.message);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid pass ID format' });
    }
    
    res.status(500).json({ error: 'Failed to fetch pass statistics' });
  }
};

// Search passes
exports.searchPasses = async (req, res) => {
  try {
    const { query, passType, minPrice, maxPrice } = req.query;
    
    const filter = {};
    
    // Text search
    if (query) {
      filter.$or = [
        { passName: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }
    
    // Filter by pass type
    if (passType) {
      filter.passType = passType;
    }
    
    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    
    const passes = await Pass.find(filter)
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      message: 'Search results retrieved successfully',
      count: passes.length,
      passes: passes.map(pass => ({
        id: pass._id,
        passName: pass.passName,
        description: pass.description,
        price: pass.price,
        passType: pass.passType,
        validity: pass.validity,
        isActive: pass.isActive
      }))
    });
  } catch (error) {
    console.error('Error searching passes:', error.message);
    res.status(500).json({ error: 'Failed to search passes' });
  }
};