import db from '../models/mongoose.js';

import Building from '../models/Building.js';

const buildingController = {

    getAllBuildings: async function (req, res) {
        try {
            // Fetch all buildings from the database
            const buildings = await Building.find({});
        
            // Render the HBS template with the building data
            // res.render('buildings', { buildings });
            console.log('it worked!');
          } catch (error) {
            console.error('Error fetching buildings:', error);
            res.status(500).send('Server error');
          }
    }

}

export default buildingController;
