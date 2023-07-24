import db from '../models/mongoose.js';
import mongoose from 'mongoose';
import Restroom from '../models/Restroom.js';
import Building from '../models/Building.js';

const restroomController = {
  getRestroomByInfo: async function (req, res) {
    // const {building, floor, gender} = req.body;
    const building = req.query.building;
    const floor = req.query.floor;
    const gender = req.query.gender;

    try {
      // Get building id 
      const buildingobj = await Building.findOne({name: building}, (err, document) => {
        if (err){
          console.log('Error in query', err); 
        } else {
          if (document) {
            console.log('Object id: ', document._id);
          } else {
            console.log('Document not found');
          }
        }
      });

      //build query
      const query = {
        floor: floor,
        gender: gender, 
        buildingID: buildingobj._id
      }

      //get restroom id
      const restroom = await Restroom.findOne(query, err => {
        if (err) return err; 

        console.log('Restroom found');
      })
      
      res.send(restroom)
      res.redirect('http://localhost:3000/create-review');
      // const restroomBuilding = req.query.building;
      // return restroomBuilding;
    } catch (error) {
      console.error('Error fetching restrooms:', error);
      res.status(500).send('Server error');
    }
  }
};

export default restroomController;