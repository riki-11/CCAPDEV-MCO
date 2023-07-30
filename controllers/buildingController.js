import db from '../models/mongoose.js';

import Building from '../models/Building.js';

const buildingController = {

    getAllBuildings: async function (req, res) {
        try {
            // Fetch all buildings from the database
            const buildings = await Building.find({}).lean();
            return buildings;
          } catch (error) {
            console.error('Error fetching buildings:', error);
            res.status(500).send('Server error');
          }
    },

    getBuildingByName: async function (buildingName) {
      try {
        const building = await Building.findOne({name: buildingName}).lean();
        return building;
      } catch (error) {
        console.error('Error fetching buildings:', error);
        res.status(500).send('Server error');
      }
    },

    getBuildingCode: async function(buildingName) {
      try {
        const building = await Building.findOne({name: buildingName}).lean();
        return building.code;
      } catch (error) {
        console.error('Error fetching building code: ', error);
        res.status(500).send('Server Error');
      }
    }
}

export default buildingController;

