const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group, User, GroupImage, Venue, Event, EventImage } = require('../../db/models');
const router = express.Router();

//Create and return a new image for an event specified by id.
router.post('/:eventId/images', requireAuth, async (req, res, next) => {
    const eventId = parseInt(req.params.eventId);

    const {url, preview} = req.body;

    const event = await Event.findByPk(eventId);

    if (!event) {
        const err = new Error("Event couldn't be found");
        err.status = 404;
        return next(err)
    }

    const newImage = await EventImage.create({
        eventId,
        url,
        preview,
    });

    delete newImage.dataValues.eventId
    delete newImage.dataValues.updatedAt
    delete newImage.dataValues.createdAt

    res.json({ newImage})
})











module.exports = router;
