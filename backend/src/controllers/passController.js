exports.createPass = async (req, res) => {
  try {
    const { passName, description, price } = req.body;
    
    // Input validation
    if (!passName || price === undefined) {
      return res.status(400).json({ error: 'Pass name and price are required' });
    }
    
    // Create new pass
    const pass = new Pass({
      passName,
      description,
      price
    });
    
    const savedPass = await pass.save();
    
    res.status(201).json({
      message: 'Pass created successfully',
      passId: savedPass._id
    });
  } catch (error) {
    console.error('Error creating pass:', error.message);
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
    
    res.status(200).json(pass);
  } catch (error) {
    console.error('Error fetching pass:', error.message);
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
      .select('title location eventDate startTime endTime');
    
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching pass events:', error.message);
    res.status(500).json({ error: 'Failed to fetch pass events' });
  }
};