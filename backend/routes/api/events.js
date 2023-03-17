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

    res.json({newImage})
});

//Edit an Event specified by its id
router.put('/:eventId', requireAuth, async (req, res, next) => {
    const eventId = parseInt(req.params.eventId);
    const {venueId, name, type, capacity, price, description, startDate, endDate} = req.body;

    const venue = await Venue.findByPk(venueId);
    if (!venue) {
        const err = new Error("Event couldn't be found");
        err.status = 404;
        return next(err)
    }

    const event = await Event.findByPk(eventId);
    if (!event) {
        const err = new Error("Event couldn't be found");
        err.status = 404;
        return next(err)
    }

    event.set({
        venueId,
        name,
        type,
        capacity,
        price,
        description,
        startDate,
        endDate,
    });

    delete event.dataValues.createdAt;
    delete event.dataValues.updatedAt;

    res.json(event);
});

//Get details of an Event specified by its id
router.get('/:eventId', async (req, res, next) => {
    const eventId = parseInt(req.params.eventId);



    const event = await Event.findByPk(eventId, {
        attributes: {exclude: ['createdAt', 'updatedAt']},
        include: [
            {model: User},
            {model: Group, attributes: {exclude: ['createdAt', 'updatedAt', 'organizerId']}},
            {model: Venue, attributes: {exclude: ['createdAt', 'updatedAt', 'groupId']}},
            {model: EventImage, as: 'EventImages', attributes: {exclude: ['createdAt', 'updatedAt', 'eventId']}},
        ],
    });

    if (!event) {
        const err = new Error("Event couldn't be found");
        err.status = 404;
        return next(err)
    }

    event.dataValues.numAttending = event.Users.length;
    delete event.dataValues.Users

    res.json(event);
});

//Get All Events
router.get('/', async (req, res, next) => {
    const events = await Event.findAll()
    const eventsArray = {Events: events};

    res.json(eventsArray);
});







module.exports = router;
