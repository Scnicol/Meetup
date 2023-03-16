const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group, User, GroupImage, Venue } = require('../../db/models');
const router = express.Router();


//Edit a Venue specified by its id
router.put('/:venueId', requireAuth, async (req, res, next) => {
    
});
