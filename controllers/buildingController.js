import db from '../models/mongoose.js';

import Building from '../models/Building.js';
import reviewController from './reviewController.js';

const buildingController = {

    getAllBuildings: async function (req, res) {
        try {
            // Fetch all buildings from the database
            const buildings = await Building.find({}).lean();
            return buildings;
          } catch (error) {
            console.error('Error fetching buildings: ', error);
            res.status(500).send('Server error');
          }
    },

    getBuildingByName: async function (buildingName) {
      try {
        const building = await Building.findOne({name: buildingName}).lean();
        return building;
      } catch (error) {
        console.error('Error fetching buildings: ', error);
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
    },

    // Get the average of all the ratings for a particular building
    getBuildingRating: async function(buildingName) {
      try {
        // Get all the reviews for that building
        const reviews = await reviewController.getReviewsByBuilding(buildingName);
        console.log(`No. of reviews: ${reviews.length}`);

        const sumOfRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
        var average = Math.ceil(sumOfRatings / reviews.length);

        if (!average) {
          average = 0;
        }

        return average;

      } catch(error) {
        console.error('Error fetching building rating: ', error);
        res.status(500).send('Server Error');
      }
    },

    // Updates a building's averageRating property
    updateBuildingRating: async function(buildingName) {
      try {
        const building = await this.getBuildingByName(buildingName);
        const rating = await this.getBuildingRating(buildingName);

        // GET LIST OF BUILDINGS THEN DO A FOREACH FOR ALL THE RATINGS NALANG 
        // CONTINUE TOMO

        building.rating = rating;
        await building.save();
      
      } catch(error) {
          console.error('Error updating building rating: ', error);
          res.status(500).send('Server Error');
      } 
    },
  
    searchBuildings: async function(searchQuery) {
      try {
        const regexQuery = new RegExp(searchQuery, 'i');
        const buildings = await Building.find({
            $or: [
                { name: regexQuery },
                { description: regexQuery }
            ]
        }).lean();
        return buildings;
      } catch (error) {
        console.error('Error fetching buildings:', error);
        res.status(500).send('Server error');

      }
    },
    chunkArray: async function (allBldgs, buildingsPerCarouselItem) {
      try {
        const chunks = [];
        for (let i = 0; i < allBldgs.length; i += buildingsPerCarouselItem) {
          chunks.push(allBldgs.slice(i, i + buildingsPerCarouselItem));
        }
        return chunks;
      } catch (error) {
        console.log('Error chunking array: ', error);
      }
    },
    getTopBuildings: async function (allBldgs, numOfBldgs) {
      allBldgs.sort((a, b) => b.rating - a.rating);

      // Get the top 5 buildings with the highest ratings
      const carouselBuildings = allBldgs.slice(0, numOfBldgs);

      return carouselBuildings;
    },
    sortBuildings: async function(buildings, sortBy) {
      switch (sortBy) {
        case 'name':
          return buildings.sort((a, b) => a.name.localeCompare(b.name));
        case 'rating_asc':
          return buildings.sort((a, b) => a.averageRating - b.averageRating);
        case 'rating_desc':
          return buildings.sort((a, b) => b.averageRating - a.averageRating);
        default:
          return buildings;
      }
    }

}

export default buildingController;

