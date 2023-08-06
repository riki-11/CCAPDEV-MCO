// Controller Imports
import userController from './userController.js'; 
import reviewController from './reviewController.js';
import buildingController from "./buildingController.js"; 
import restroomController from "./restroomController.js";

// Database access
import User from '../models/User.js';
import Building from '../models/Building.js';
import Restroom from '../models/Restroom.js';
import Review from '../models/Review.js';


const routeController = {

   renderHomePage: async function(req, res) {
        const allBldgs = await buildingController.getAllBuildings();
        const bannerBuildings = await buildingController.getTopBuildings(allBldgs, 2);
        const topRatedBldgs = await buildingController.getTopBuildings(allBldgs, 5);
      
        const buildingsPerCarouselItem = 5;
        const allBldgsChunked = await buildingController.chunkArray(allBldgs, buildingsPerCarouselItem);
      
        res.render("index", {
          title: "Flush Finder",
          forBusiness: false,
          allBldgs: allBldgs,
          allBldgsChunked: allBldgsChunked,
          bannerBuildings: bannerBuildings,
          topRatedBldgs: topRatedBldgs
        });
    },

    renderAboutPage: async function(req, res) {
        res.render("about", {
          title: "About Us",
        });
    },

    renderRegisterPage: async function(req, res) {
        res.render("register", {
          title: "Sign Up",
        });
    },

    renderLogInPage: async function(req, res) {
        res.render("login", {
          title: "Log In",
        });
    },

    renderProfilePage: async function(req, res, next) {

        try {
            const { username } = req.query;
            let user;
            let currentUser;
            // console.log(username)

            if (req.user.isOwner){
                routeController.renderEstablishmentPage(req,res);
                next();
            }

            //if user is accessing own profile, username is empty. if they click on their name in the reviews, username == req.user.username
            if (req.user){ 
                if (!username || username == req.user.username) { // Logged in and accessing own profile
                    user = req.user;
                    currentUser = true;
                }  else { // Logged in and accessing different profile
                    user = await User.findOne({'username': username}).exec();
                    currentUser = false
                }
            } else { // User is not logged in but views users' profiles
                user = await User.findOne({'username': username}).exec();
                currentUser = false
            }

            if (!user) {
                return res.status(404).send('User not found');
            }
            const reviews = await Review.find({ 'user' : user })
            .populate({
                path: 'restroomID', // Populate the restroomID field
                populate: {
                path: 'buildingID', // Populate the buildingID field of the nested Restroom model
                select: 'name', // Select only the name property of the buildingID
                },
            })
            .lean();
            
            const senduser = {
                isOwner: user.isOwner,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                description: user.description,
            }

            const profImgSrc = user.photo && user.photo.contentType ? `data:${user.photo.contentType};base64,${user.photo.data.toString('base64')}` : null;

            res.render('viewprofile', { 
            title: 'Profile',
            forBusiness: false,
            user: senduser,
            profImgSrc: profImgSrc,
            currentUser: currentUser,
            reviews: reviews.map(review => ({
                ...review,
                user: senduser,       // Pass the user object to each review
                profImgSrc: profImgSrc, // Pass the imageSrc to each review
                currentUser: currentUser,
                photoSrc: review.photo && review.photo.contentType ? `data:${review.photo.contentType};base64,${review.photo.data.toString('base64')}` : null,      }))    
            }); 
        
        } catch (error) {
            console.error('Error fetching user data:', error);
            res.status(500).send('Server error');
        }
    },

    renderEditProfilePage: async function(req, res) {
        try {
            const user = req.user
            const userinfo = {
              firstName: req.user.firstName,
              lastName: req.user.lastName,
              username: req.user.username,
              email: req.user.email,
              password: req.user.password,
              description: req.user.description
            }
        
            if (!req.user) {
              return res.status(404).send('User not found');
            }
        
            if (user.photo && user.photo.contentType) {
              const imageSrc = `data:${user.photo.contentType};base64,${user.photo.data.toString('base64')}`;
              res.render('editprofile', { 
                title: 'Edit Profile',
                forBusiness: false,
                user: userinfo,
                imageSrc: imageSrc,
              });
        
            } else {
              res.render('editprofile', { 
                title: 'Edit Profile',
                forBusiness: false,
                user: userinfo
              });
            }
    
          } catch (error) {
            console.error('Error fetching user data:', error);
            res.status(500).send('Server error');
          }
    },


    renderFindBathroomPage: async function(req, res) {
        res.render("select-restroom", {
            title: "Select a Restroom To Review",
          });
    },

    renderCreateReviewPage: async function(req, res) {
        const { name, floor, gender, restroomId } = req.query;
        const dataToSend = {
          name: name,
          floor: floor,
          gender: gender,
          restroomId: restroomId
        };
      
        res.render('createreview', { data: dataToSend });
    },

    renderEditReviewPage: async function(req, res) {
        try {
            const reviewId = req.query.reviewId;
            const review = await Review.findById(reviewId).lean();
            const restroom = await Restroom.findById(review.restroomID).lean();
            const building = await Building.findById(restroom.buildingID).lean();

            // for the boolean conditions in editreview
            const hasBidet = review.amenities.includes("bidet");
            const hasFaucet = review.amenities.includes("faucet");
            const hasFlush = review.amenities.includes("flush");
            const hasTissue = review.amenities.includes("tissue");
            const hasHanddryer = review.amenities.includes("handdryer");

            const rated1 = (review.rating == 1);
            const rated2 = (review.rating == 2);
            const rated3 = (review.rating == 3);
            const rated4 = (review.rating == 4);
            const rated5 = (review.rating == 5);

            const dateCreated = new Date(review.dateCreated).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
            });

            
            res.render("editreview", {
            title: "Edit My Review",
            forBusiness: false,
            review: review,
            building: building,
            restroom: restroom,
            date: dateCreated,
            amenities: {
                bidet: hasBidet,
                faucet: hasFaucet,
                flush: hasFlush,
                tissue: hasTissue,
                handdryer: hasHanddryer
            },
            ratings: {
                rated1: rated1,
                rated2: rated2,
                rated3: rated3,
                rated4: rated4,
                rated5: rated5
            },
            photoSrc: review.photo && review.photo.contentType ? `data:${review.photo.contentType};base64,${review.photo.data.toString('base64')}` : null, 

            });
        } catch (error) {
            console.error('Error fetching user data:', error);
            res.status(500).send('Server error');  
        }
    },

    renderEstablishmentPage: async function(req, res) {
        try {
            const user = req.user;
            const buildingName = req.query.building;
            const reviews = await reviewController.getReviewsByBuilding(buildingName);
            const rating = await buildingController.getBuildingRating(buildingName);
            const building = await buildingController.getBuildingByName(buildingName);
        
            if (!building) {
              res.redirect('/404');
            }
        
            // If current user is an owner 
            // TODO: make sure the owner is the owner of THIS particular building  
            if (user !== undefined) {
                // If the current user is the owner of the current building
                if (user.isOwner === true && user._id.toString() === building.ownerID.toString()) {
                    var ownerView = true;
                }
            } else {
                var ownerView = false;
            }

            res.render("establishmentview", {
              title: buildingName,
              forBusiness: false,
              building: building,
              reviews: reviews,
              rating: rating,
              ownerView: ownerView,
              searched:false
            }); 
        
          } catch (error) {
            res.status(500).send('Server error');
          }
    },

    renderSearchResultsPage: async function(req, res) {
        try {
            const searchQuery = req.query.q;
            const sortBy = req.query.sortBy;
            
            // Fetch search results based on searchQuery
            let searchResults = await buildingController.searchBuildings(searchQuery);
        
            // If sortBy is provided, sort the searchResults
            if (sortBy) {
                searchResults = await buildingController.sortBuildings(searchResults, sortBy);
                console.log(searchResults);
        
            }
            
            const buildingsWithReviewCount = await Promise.all(
                searchResults.map(async (building) => {
                const reviewCount = await reviewController.getReviewsCountForBuilding(building.name);
                return { ...building, reviewCount };
                })
            );
            
            res.render("results", {
                title: "Search Results",
                forBusiness: false,
                searchResults: buildingsWithReviewCount,
                searchQuery: searchQuery,
                sortBy: sortBy,
            });
        } catch (err) {
        console.error("Error occurred during search:", err);
        res.status(500).send("An error occurred while fetching search results.");
        }
    },

    getReviewSearchResults: async function(req, res) {
        try {
            console.log('Request URL:', req.url);

            const searchQuery = req.query.q;
            const sortBy = req.query.sortBy;
            const buildingName = req.query.building;

            const reviews = await reviewController.getReviewsByBuilding(buildingName);
            const rating = await buildingController.getBuildingRating(buildingName);
            const building = await buildingController.getBuildingByName(buildingName);

            const buildingID = building._id;
            
            // Fetch search results based on searchQuery
            let searchResults = await reviewController.searchReviews(searchQuery, buildingID);
            // If sortBy is provided, sort the searchResults
            if (sortBy) {
                searchResults = await reviewController.sortReviews(searchResults, sortBy);
                console.log(searchResults);
            }


              // Assuming searchResults is an array of review objects
            for (const review of searchResults) {
                // Assuming review.restroomID.buildingID holds the building ID associated with the review
                let restroom = await Restroom.findById(review.restroomID);
                let revBuilding = restroom.buildingID;
                let building = await Building.findById(revBuilding);
                let user = await User.findById(review.user);

                const username = user.username;
                const profpic = user.photo && user.photo.contentType ? `data:${user.photo.contentType};base64,${user.photo.data.toString('base64')}` : null;
                const buildingName = building.name;
                const floor = restroom.floor;
                const gender = restroom.gender;
                const photoSrc = review.photo && review.photo.contentType ? `data:${review.photo.contentType};base64,${review.photo.data.toString('base64')}` : null;

                review.photoSrc = photoSrc;
                review.buildingName = buildingName;
                review.floor = floor;
                review.gender = gender;

                review.username = username;
                review.profpic = profpic;
        
            }
            
   
            res.render("establishmentview", {
                title: buildingName,
                building: building,
                reviews: reviews,
                rating: rating,
                searchResults: searchResults,
                searchQuery: searchQuery,
                sortBy: sortBy,
                searched:true
              }); 
          
        } catch (err) {
            console.error("Error occurred during search:", err);
            res.status(500).send("An error occurred while fetching search results.");
        }
    },

    getRestroomOptions: async function(req, res) {
        // Get all the buildings from the database
        buildingController.getAllBuildings().then(buildings => {
            var buildingNames = [];
            var buildingFloors = [];
            buildings.forEach(building => {
            // Grab the names of all the buildings
            buildingNames.push(building.name);

            // Grab the number of floors per building
            buildingFloors.push(building.numOfFloors);
            })

            res.render("select-restroom",  {
            title: "Select a Restroom To Review",
            forBusiness: false, 
            buildings: buildings,
            buildingNames: buildingNames,
            buildingFloors: buildingFloors
            })
        });
    },

    getBuildingReviews: async function(req, res) {
        const buildingName = req.query.building;
        const reviews = await reviewController.getReviewsByBuilding(buildingName);
        
        if (reviews) {
            res.json(reviews);
        } else {
            res.status(500).send('Reviews not found');
        }
    },

    getBuildingRestrooms: async function(req, res) {
        const buildingName = req.query.building;
        const restrooms = await restroomController.getRestroomsByBuilding(buildingName);

        if (restrooms) {
            res.json(restrooms);
        } else {
            res.status(500).send('Restrooms not found');
        }
    },

    getBuildingData: async function(req, res) {
        const building = await buildingController.getBuildingByName(req.query.building);
        // If we successfully found the right bldg in the database, send a response
        if (building) {
            res.json(building);
        } else {
            res.status(500).send('Building not found');
        }
    },

    getBuildingCode: async function(req, res) {
        const buildingCode = await buildingController.getBuildingCode(req.query.building);
        if (buildingCode) {
            res.json(buildingCode);
        } else {
            res.status(404).send('Building not found');
        }
    },

    updateBuildingRatings: async function(req, res) {
        await buildingController.updateBuildingRatings();
    },

    deleteReviews: async function(req, res) {
        const reviewId = req.query.reviewId;
        try {
          // Find the review in the database by its ID
          const result = await Review.deleteOne({_id: reviewId}).exec();
          res.json({ message: 'Review deleted successfully.' });
        } catch (error) {
          console.error('Error occurred:', error);
          res.status(500).json({ message: 'Internal server error.' });
        }
    },

    logoutUser: async function(req, res) {
        req.logout(() => {});
        res.redirect('/login');
    },




}


export default routeController;
