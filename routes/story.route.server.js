const { ObjectID } = require('mongodb');


const storyDao = require('../dao/story.dao.server');
const commentDao = require('../dao/comment.dao.server');
const taxonomyDao=require('../dao/taxonomy.dao.server');
const role = require('../constants/role');
let grabity = require("grabity");


//Hardcoded for now as the new collection design is not finalized
        // *********MUST DELETE*********
const strategies = ["Mitigation", "Adaptation"];
const sectors = ["Buildings and Cities", "Electricity Generation", "Food", "Land Use", "Materials", "Transport", 
        "Women and Girls", "Ecosystem-based", "Engineered and Built Envionment", "Technological", "Services", 
        "Educational", "Informational", "Behavioral", "Economic", "Laws and regulations", "Government policies and programs"];
const solutions = ["District Heating", "Insulation", "LED Lighting (Household)", "Heat Pumps", "LED Lighting (Commercial)", 
        "Building Automation", "Walkable Cities", "Smart Thermostats", "Landfill Methane", "Bike Infrastructure", "Smart Glass", 
        "Water Distribution", "Green Roofs", "Net Zero Buildings", "Retrofitting", "Wind Turbines (Onshore)", "Solar Farms", "Rooftop Solar", 
        "Geothermal", "Nuclear", "Wind Turbines (Offshore)", "Concentrated Solar", "Wave and Tidal", "Methane Digesters (Large)", "Biomass", 
        "Solar Water", "In-Stream Hydro", "Cogeneration", "Methane Digesters (Small)", "Waste-to-Energy", "Micro Wind", "Energy Storage (Distributed)", 
        "Energy Storage (Utilities)", "Grid Flexibility", "Microgrids", "Reduced Food Waste", "Plant-Rich Diet", "Silvopasture", "Regenerative Agriculture", 
        "Tropical Staple Trees", "Conservation Agriculture", "Tree Intercropping", "Managed Grazing", "Clean Cookstoves", "Farmland Restoration", 
        "Improved Rice Cultivation", "Multistrata Agroforestry", "System of Rice Intensification", "Composting", "Nutrient Management", "Farmland Irrigation", 
        "Biochar", "Tropical Forests", "Temperate Forests", "Peatlands", "Afforestation", "Bamboo", "Forest Protection", "Indigenous Peoples’ Land Management", 
        "Perennial Biomass", "Coastal Wetlands", "Refrigerant Management", "Alternative Cement", "Water Saving - Home", "Bioplastic", "Household Recycling", 
        "Industrial Recycling", "Recycled Paper", "Electric Vehicles", "Ships", "Mass Transit", "Trucks", "Airplanes", "Cars", "Telepresence", "High-speed Rail", 
        "Electric Bikes", "Trains", "Ridesharing", "Educating Girls", "Family Planning", "Women Smallholders", "Ecological restoration", 
        "wetland and floodplain conservation and restoration", "increasing biological diversity", "afforestation and reforestation", 
        "conservation and replanting mangrove forest", "bushfire reduction and prescribed fire", "green infrastructure", "controlling overfishing", 
        "fisheries co-management", "assisted migration or managed translocation", "ecological corridors", "ex situ conservation", "seed banks", 
        "community-based natural resource management", "adaptive land use management", "Seawalls and coastal protection structures", "flood levees and culverts", 
        "water storage and pump storage", "sewage works", "improved drainage", "beach nourishment", "flood and cyclone shelters", "building codes", 
        "storm and wastewater management", "transport and road infrastruction adaptation", "floating houses", "adjusting power plants and electricity grids", 
        "New crop and animal varieties", "genetic techniques", "traditional technologies and methods", "efficient irrigation", "water saving technologies", 
        "rainwater harvesting", "food storage and preservation facilities", "hazard mapping and monitoring technology", "early warning system", "building insulation", 
        "mechanical and passive cooling", "renewable energy technologie", "second-generation biofuels", "Social safety nets and social protection", 
        "food banks and distribution of food surplu", "municipal services including water and sanitation", "vaccination programs", "essential public health services", 
        "including reproductive health services", "enhanced emergency medical services", "international trade", "Awareness raising and integrating into education", 
        "gender equity in education", "extension services", "sharing local and traditional knowledge", "integrating into adaptation planning", 
        "participatory action research and social learning", "community surveys", "knowledge-sharing and learning platforms", "international conferences and research networks", 
        "communication through media", "Hazard and vulnerability mapping", "early warning and response systems", "including health early warning systems", 
        "systematic monitoring and remote sensing", "improved forecasts", "downscaling climate scenarios", "longitudinal data sets", "integrating indigenous climate observations", 
        "community-based adaptation plan", "community-driven slum upgrading", "participatory scenario development", "Accommodation", "household preparation and evacuation planning", 
        "retreat", "migration", "human health", "human security", "soil and water conservation", "livelihood diversification", "changing livestock and aquaculture practices", 
        "changing cropping", "crop-switching", "practices, patterns, and planting dates", "silvicultural option", "reliance on social networks", 
        "Financial incentives including taxes and subsidies", "insurance", "including index-based weather insurance schemes", "catastrophe bonds", "revolving funds", 
        "payments for ecosystem services", "water tariffs", "savings groups", "microfinance", "disaster contingency funds", "cash transfers", "Land zoning laws", 
        "building standards", "easements", "water regulations and agreements", "laws to support disaster risk reduction", "laws to encourage insurance purchasing", 
        "defining property rights and land tenure security", "protected areas", "marine protected areas", "fishing quotas", "patent pools and technology transfer", 
        "National and regional adaptation plans", "mainstreaming climate change", "sub-national and local adaptation plans", "urban upgrading programs", 
        "municipal water management programs", "disaster planning and preparedness", "city-level plans", "district-level plans", "sector plans", 
        "integrated water resource management", "landscape and watershed managemen", "integrated coastal zone management", "adaptive management", "ecosystem-based management", 
        "sustainable forest management", "fisheries management", "community-based adaptation"];


module.exports = app => {

    findAllStories = (req, res) => {
        page = 1;
        limit = 100;
        if (req.query.page){
            page = parseInt(req.query.page)
        }
        if (req.query.limit){
            limit = parseInt(req.query.limit)
        }
        if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) { //If non integer values provided for limit or page
            console.log("Error");
            return res.status(400).send({"Error": "Invalid Query Params"})
        }
        storyDao.findAllStories(limit, page).then(stories => res.json(stories));
    };

    findAllStrategy = (req, res) => {
        //Hardcoded for now as the new collection design is not finalized
        // *********MUST UPDATE*********

        res.json(strategies);
    };

    findAllSolution = (req, res) => {
        //Hardcoded for now as the new collection design is not finalized
        // *********MUST UPDATE*********

        res.json(solutions);
    };

    findAllSector = (req, res) => {
        //Hardcoded for now as the new collection design is not finalized
        // *********MUST UPDATE*********
        
        res.json(sectors);
    };

    findStrategyByName = (req, res) => {
        //Hardcoded for now as the new collection design is not finalized
        // *********MUST UPDATE*********

        res.json(strategies.filter(word => word.toLowerCase().includes(req.params.strategy.toLowerCase())));
    };

    findSolutionByName = (req, res) => {
        //Hardcoded for now as the new collection design is not finalized
        // *********MUST UPDATE*********

        res.json(solutions.filter(word => word.toLowerCase().includes(req.params.solution.toLowerCase())));
    };

    findSectorByName = (req, res) => {
        //Hardcoded for now as the new collection design is not finalized
        // *********MUST UPDATE*********

        res.json(sectors.filter(word => word.toLowerCase().includes(req.params.sector.toLowerCase())));
    };

    const findAllTaxonomy=(req,res)=>{
        taxonomyDao.findAllTaxonomy().then(story=>res.json(story))};

    const findTaxonomyBySolution=(req,res)=>{
        taxonomyDao.findTaxonomyBySolution(req.params.solution).then(result=>res.json(result));
    };
    const findTaxonomyBySector=(req,res)=>{
        taxonomyDao.findTaxonomyBySector(req.params.sector).then(result=>res.json(result));
    };
    const findTaxonomyByStrategy=(req,res)=>{
        taxonomyDao.findTaxonomyByStrategy(req.params.strategy).then(result=>res.json(result));
    };

    findStoryByStoryID = (req, res) => {
        if(!ObjectID.isValid(req.params.storyID)) {
            return res.status(404).send({
                message: "Story doesn't exist!"
            });
        }

        storyDao.findStoryByStoryID(req.params.storyID).then(story => {
            if(!story) {
                return res.status(404).send();
            }
            res.json(story);
        }).catch((error) => {
            res.status(500).send({error});
        });
    };

    findStoryByPlaceID = (req,res)=> {
        page = 1;
        limit = 20;
        if (req.query.page){
            page = parseInt(req.query.page)
        }
        if (req.query.limit){
            limit = parseInt(req.query.limit)
        }
        if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) { //If non integer values provided for limit or page
            console.log("Error");
            return res.status(400).send({"Error": "Invalid Query Params"})
        }

        storyDao.findStoryByPlaceID(req.params.placeID, limit, page).exec((error,stories) => {
            if(error) {
                res.status(500).send({error});
            }
            res.json(stories);
        });
    };

    findStoryByTitle = (req,res)=> {
        page = 1;
        limit = 20;
        if (req.query.page){
            page = parseInt(req.query.page)
        }
        if (req.query.limit){
            limit = parseInt(req.query.limit)
        }
        if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) { //If non integer values provided for limit or page
            console.log("Error");
            return res.status(400).send({"Error": "Invalid Query Params"})
        }
        storyDao.findStoryByTitle(req.params.title, limit, page).exec((err,stories) => {
            res.json(stories)
        });
    };

    findStoryByDescription = (req,res)=> {
        page = 1;
        limit = 20;
        if (req.query.page){
            page = parseInt(req.query.page)
        }
        if (req.query.limit){
            limit = parseInt(req.query.limit)
        }
        if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) { //If non integer values provided for limit or page
            console.log("Error");
            return res.status(400).send({"Error": "Invalid Query Params"})
        }
        storyDao.findStoryByDescription(req.params.description, limit, page).exec((err,stories) => {
            res.json(stories)
        });
    };

    findTopStories = (req, res) =>
        storyDao.findTopStories(req.params.numberOfStories).then(stories => res.json(stories));

    findUnratedStories = (req, res) => {
        page = 1;
        limit = 20;
        if (req.query.page){
            page = parseInt(req.query.page)
        }
        if (req.query.limit){
            limit = parseInt(req.query.limit)
        }
        if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) { //If non integer values provided for limit or page
            console.log("Error");
            return res.status(400).send({"Error": "Invalid Query Params"})
        }

        storyDao.findUnratedStories(limit, page).exec((err,stories) => {
            res.json(stories)
        });

    };

    findStoryBySolution = (req,res)=> {
        page = 1;
        limit = 20;
        if (req.query.page){
            page = parseInt(req.query.page)
        }
        if (req.query.limit){
            limit = parseInt(req.query.limit)
        }
        if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) { //If non integer values provided for limit or page
            console.log("Error");
            return res.status(400).send({"Error": "Invalid Query Params"})
        }

        storyDao.findStoryBySolution(req.params.solution, limit, page).exec((error,stories) => {
            res.json(stories);
        });
    };

    findStoryBySector = (req,res)=> {
        page = 1;
        limit = 20;
        if (req.query.page){
            page = parseInt(req.query.page)
        }
        if (req.query.limit){
            limit = parseInt(req.query.limit)
        }
        if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) { //If non integer values provided for limit or page
            console.log("Error");
            return res.status(400).send({"Error": "Invalid Query Params"})
        }
        storyDao.findStoryBySector(req.params.sector, limit, page).exec((error,stories) => {
            res.json(stories);
        });
    };

    findStoryByStrategy = (req,res)=> {
        page = 1;
        limit = 20;
        if (req.query.page){
            page = parseInt(req.query.page)
        }
        if (req.query.limit){
            limit = parseInt(req.query.limit)
        }
        if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) { //If non integer values provided for limit or page
            console.log("Error");
            return res.status(400).send({"Error": "Invalid Query Params"})
        }
        storyDao.findStoryByStrategy(req.params.strategy, limit, page).exec((error,stories) => {
            res.json(stories);
        });
    };

    createStory = (req, res) =>
        storyDao.createStory(req.body)
                .then((story) => res.json(story),
                      (error) => res.status(500).send({error}));


    deleteStory = (req, res) => {
        const {storyId} = req.params;
        if (!ObjectID.isValid(storyId)) {
            return res.status(404).send({error: "Story doesn't exist!"});
          }

        storyDao.deleteStory(storyId).then((error, removed) => {
            if(error) {
                return res.status(500).send({error});
            }

            res.json(removed);
        });
    };

    updateStory = (req, res) => {
        const {storyId} = req.params;
        if (!ObjectID.isValid(storyId)) {
            return res.status(404).send();
          }
        storyDao.updateStory(storyId, req.body)
                .then(story => res.json(story))
                .catch((error) => res.status(500).send({error}));
    };

    const likeStory = (req, res) => {
        storyDao.findStoryByStoryID(req.params.storyID)
            .then(story => {
                if(!story) {
                    return res.status(404).send();
                }
                const updatedStory = storyDao.likeStory(story, parseInt(req.params.userID,10));
                storyDao.updateStory(story.story_id, updatedStory).then(response => {
                    res.send(response);
                });
            });
    };

    const unlikeStory = (req, res) => {
        storyDao.findStoryByStoryID(req.params.storyID)
            .then(story => {
                const updatedStory = storyDao.unlikeStory(story, parseInt(req.params.userID,10));
                if(updatedStory) {
                    storyDao.updateStory(story.story_id, updatedStory).then(response => {
                        res.send(response);
                    });
                } else {
                    res.send(story);
                }
            });
    };

    const flagStory = (req, res) => {
        storyDao.findStoryByStoryID(req.params.storyID)
            .then(story => {
                if(!story) {
                    return res.status(404).send();
                }
                let user_id =  parseInt(req.params.userID,10);
                if(isNaN(user_id)){
                    console.log("User id not a number");
                    return res.status(400).send({"Error": "Invalid Query Params"})
                }
                const updatedStory = storyDao.flagStory(story, user_id);
                storyDao.updateStory(story.story_id, updatedStory).then(response => {
                    res.send(response);
                });
            });
    };

    const unflagStory = (req, res) => {
        storyDao.findStoryByStoryID(req.params.storyID)
            .then(story => {
                if(!story) {
                    return res.status(404).send();
                }
                let user_id =  parseInt(req.params.userID,10);
                if(isNaN(user_id)){
                    console.log("User id not a number");
                    return res.status(400).send({"Error": "Invalid Query Params"})
                }
                const updatedStory = storyDao.unflagStory(story, user_id);
                if(updatedStory) {
                    storyDao.updateStory(story.story_id, updatedStory).then(response => {
                        res.send(response);
                    });
                } else {
                    res.send(story);
                }
            });
    };

    addRatingToStory = (req, res) => {
        if (!ObjectID.isValid(req.body.storyID)) {
            return res.status(404).send();
          }

        if(req.body.role) {
            if(req.body.role === role.MODERATOR || req.body.role === role.ADMIN) {
                storyDao.findStoryByStoryID(req.body.storyID)
                .then((story) => {
                    story.rating = req.body.rating;
                    storyDao.updateStory(story.story_id, story).then((response) => {
                        res.status(200).send(response);
                    });
                })
            }
            else {
                res.status(401).send();
            }
        }
        else {
            res.status(401).send();
        }
    };

    // there is no check for userId being valid here. The expectation is that only validated users would be able to
    // navigate to comment page
    const addComment = (req,res) => {

        const storyId = req.body.storyId;
        const userId = req.body.userId;
        const content = req.body.content;
        const date = req.body.date;
        const username = req.body.username;

        storyDao.findStoryByStoryID(storyId).then(story => {
            if(story){
                commentDao.addComment(userId,content,date,username).then(comment => {
                    story.comments.push(comment);
                    storyDao.updateStory(story.story_id,story).then(() => {
                        res.send(comment);
                    })
                });
            }
            else{
                res.status(403).send({
                    success: false,
                    message: "Story does not exist or has been deleted."
                })
            }
        })
    };

    // Only allows users to delete their own comment. Moderators and Admin can delete any comment.
    const deleteComment = (req, res) => {
        const storyId = req.body.storyId;
        const userId = req.body.userId;
        const commentId = req.body.commentId;
        const user_role = req.body.role;

        storyDao.findStoryByStoryID(storyId).then(story => {
            if (story) {
                commentDao.findCommentById(commentId).then(comment => {
                    if (comment) {
                        if ((comment.user_id === userId && user_role === role.REGISTERED_USER)
                            || user_role === role.ADMIN || user_role === role.MODERATOR) {
                            story.comments = story.comments.filter(update => update.comment_id !== commentId);
                            commentDao.deleteComment(commentId);
                            storyDao.updateStory(story.story_id, story).then(() => {
                                res.status(200).send();
                            });
                        } else {
                            res.status(403).send({
                                success: false,
                                message: "User can only delete their own comments."
                            });
                        }
                    } else {
                        res.status(403).send({
                            success: false,
                            message: "Comment does not exist or has been deleted."
                        });
                    }
                })
            } else {
                res.status(403).send({
                    success: false,
                    message: "Story does not exist or has been deleted."
                });
            }
        });
    };

    const findAllComments = (req, res) =>
        commentDao.findAllComments().then(comments => res.json(comments));

    let getPreview = async (req,res) => {
        const hyperlink = "" + req.query.hyperlink;
        try{
        let metadata = await grabity.grabIt(hyperlink);
        res.send(metadata);
        } catch(e) {
            res.status(403).send({
                success: false,
                message: "Unable to get metadata due to error in url or timeout"
            });
        }
    };

    app.get('/stories', findAllStories);
    app.get('/stories/all/strategy', findAllStrategy);
    app.get('/stories/all/solution', findAllSolution);
    app.get('/stories/all/sector', findAllSector);
    app.get('/stories/all/strategy/:strategy', findStrategyByName);
    app.get('/stories/all/solution/:solution', findSolutionByName);
    app.get('/stories/all/sector/:sector', findSectorByName);
    app.get('/stories/story/:storyID', findStoryByStoryID);
    app.get('/stories/place/:placeID',findStoryByPlaceID);
    app.get('/stories/title/:title',findStoryByTitle);
    app.get('/stories/topStories/:numberOfStories', findTopStories);
    app.get('/stories/unrated', findUnratedStories);
    app.get('/stories/description/:description',findStoryByDescription);
    app.get('/stories/sector/:sector', findStoryBySector);
    app.get('/stories/solution/:solution', findStoryBySolution);
    app.get('/stories/strategy/:strategy', findStoryByStrategy);
    app.post('/stories/create', createStory);
    app.delete('/stories/delete/:storyId', deleteStory);
    app.put('/stories/update/:storyId', updateStory);
    app.put('/stories/:storyID/like/:userID', likeStory);
    app.put('/stories/:storyID/unlike/:userID', unlikeStory);
    app.put('/stories/:storyID/flag/:userID', flagStory);
    app.put('/stories/:storyID/unflag/:userID', unflagStory);
    app.put('/stories/rating/update', addRatingToStory);
    //Comments
    app.post('/stories/story/comment',addComment);
    app.get('/stories/comment',findAllComments);
    app.delete('/stories/story/comment',deleteComment);
    // preview
    app.get('/stories/getPreview',getPreview);

    //taxonomy
    app.get('/stories/taxonomy',findAllTaxonomy);
    app.get('/stories/taxonomy/solution/:solution',findTaxonomyBySolution);
    app.get('/stories/taxonomy/strategy/:strategy',findTaxonomyByStrategy);
    app.get('/stories/taxonomy/sector/:sector',findTaxonomyBySector);
};   
