const path = require('path');

const express = require('express');

const homeController = require('../controllers/home');

const router = express.Router();


router.get('/', homeController.getHomePage);

router.post('/purchase', homeController.postPurchase);


module.exports = router;