/**
 * This file for handling request related to story.
 *
 */

const express = require('express');
const router = express.Router();

const getStoryByID_controller=require('../controllers/getStoryByPlaceID_controller');

//set controller for getStoryByID
router.get('/story/:placeID',getStoryByID_controller.getStoryByPlaceID);

module.exports=router;