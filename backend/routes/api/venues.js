const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group, User, GroupImage, Venue } = require('../../db/models');
const router = express.Router();


//Edit a Venue specified by its id
router.put('/:venueId', requireAuth, async (req, res, next) => {
    const venueId = parseInt(req.params.venueId);
    const { address, city, state, lat, lng} = req.body;

    let venue = await Venue.findByPk(venueId, {
        attributes: ['id', 'groupId', 'address', 'city', 'state', 'lat', 'lng']
    });

    if (!venue) {
        const err = new Error("Venue couldn't be found");
        err.status = 404;
        return next(err)
    }

    venue.set({
        address,
        city,
        state,
        lat,
        lng
    });
    venue.save();

    res.json(venue);
});

module.exports = router;
