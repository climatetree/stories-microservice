const express = require('express');
const router = express.Router();

const solutions_controller = require('../controllers/solutions.controller');

router.get('/test', solutions_controller.test);

module.exports = router;