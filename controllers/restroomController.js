import db from '../models/mongoose.js';
import mongoose from 'mongoose';
import Restroom from '../models/Restroom.js';
import Building from '../models/Building.js';
import buildingController from './buildingController.js';

const restroomController = {
  getRestroomByInfo: async function (req, res) {
    // const {building, floor, gender} = req.body;
    const building = req.query.building;
    const floor = req.query.floor;
    const gender = req.query.gender;

    try {
      // Get building id 
      const buildingobj = await Building.findOne({name: building});
      //console.log(buildingobj._id);
      //build query
      const query = {
        floor: floor,
        gender: gender, 
        buildingID: buildingobj._id
      }

      //get restroom id
      const restroom = await Restroom.findOne(query);
      //console.log(restroom._id)
      //res.send(restroom)
      const dataToSend = { name: building, floor: floor, gender: gender, restroomId: restroom._id};
      const queryString = new URLSearchParams(dataToSend).toString();
      res.redirect(`create-review?${queryString}`);
      //res.redirect('http://localhost:3000/create-review');

    } catch (error) {
      console.error('Error fetching restrooms:', error);
      res.status(500).send('Server error');
    }
  },

  // Gets all the restrooms given a building
  getRestroomsByBuilding: async function(buildingName) {
    try {
      const building = await buildingController.getBuildingByName(buildingName);
      const restrooms = await Restroom.find({buildingID: building._id}).lean();
      
      return restrooms;
    } catch (error) {
      console.error('Error fetching restrooms:', error);
      res.status(500).send('Server error');
    }
  }
};

export default restroomController;