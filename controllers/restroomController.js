import db from '../models/mongoose.js';

import Restroom from '../models/Restroom.js';

const restroomController = {
  getRestroomByInfo: async function (req, res) {
    try {
      const restroomBuilding = req.query.building;
      return restroomBuilding;
    } catch (error) {
      console.error('Error fetching restrooms:', error);
      res.status(500).send('Server error');
    }
  }
};

export default restroomController;