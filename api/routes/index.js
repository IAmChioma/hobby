const express = require('express');
const teamRoutes = require('./teamRoute');
const userRoutes = require('./userRoute');
const router = express.Router();


router.use('/users', userRoutes);
router.use('/teams', teamRoutes);


module.exports = router;

