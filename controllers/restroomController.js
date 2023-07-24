import db from '../models/mongoose.js';

import Restroom from '../models/Restroom.js';

const restroomController = {
  getRestroomByInfo: async function (req, res) {
    try {
      const building = req.query.building;
      const floor = req.query.floor;
      const gender = req.query.gender;
      const query = {building: building, 
                     floor: floor, 
                     gender: gender};

      // get building by id
      return query;

    } catch (error) {
      console.error('Error fetching restrooms:', error);
      res.status(500).send('Server error');
    }
  }
};

export default restroomController;