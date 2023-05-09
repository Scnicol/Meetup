const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group, User, GroupImage, Venue, Event, EventImage, Attendance, Membership } = require('../../db/models');
const group = require('../../db/models/group');
const router = express.Router();
const { Op } = require("sequelize");

//Request attendance for an event specified by id.
router.post('/:eventId/attendance', requireAuth, async (req, res, next) => {
    const eventId = parseInt(req.params.eventId);
    const userId = req.user.id;


    const event = await Event.findByPk(eventId, {
        attributes: ['name'],
        include: {
            model: Attendance,
            attributes: ['userId', 'status']
        }
    });

    if (!event) {
        const err = new Error("Event couldn't be found");
        err.status = 404;
        return next(err)
    }


    const findAttendance = await Attendance.findOne({
        where: {
            userId,
            eventId
        }
    });

    if (!findAttendance) {
        await Attendance.create({
            userId,
            eventId,
            status: 'pending',
        });

        const newStatusPending = { userId: userId, status: 'pending' }
        return res.json(newStatusPending);
    }

    if (findAttendance.dataValues.status === 'pending') {
        const err = new Error("Attendance has already been requested");
        err.status = 400;
        return next(err)
    }
    if (findAttendance.dataValues.status === 'attending') {
        const err = new Error("User is already an attendee of the event");
        err.status = 400;
        return next(err)
    }

});

//Create and return a new image for an event specified by id.
router.post('/:eventId/images', requireAuth, async (req, res, next) => {
    const eventId = parseInt(req.params.eventId);

    const { url, preview } = req.body;

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

    res.json( newImage )
});

//Change the status of an attendance for an event specified by id.
router.put('/:eventId/attendance', requireAuth, async (req, res, next) => {
    const eventId = parseInt(req.params.eventId);
    const {userId, status} = req.body

    const event = await Event.findByPk(eventId);

    if (!event) {
        const err = new Error("Event couldn't be found");
        err.status = 400;
        return next(err)
    }

    const attendee = await Attendance.findOne({
        attributes: ['id', 'eventId', 'userId', 'status'],
        where: {
            userId,
            eventId,
        }
    });

    if (!attendee) {
        const err = new Error("Attendance between the user and the event does not exist");
        err.status = 400;
        return next(err)
    }

    if (status === 'pending') {
        const err = new Error("Cannot change an Attendance status to pending");
        err.status = 400;
        return next(err)
    }

    attendee.set({
        userId,
        status,
    });
    attendee.save();

    delete attendee.dataValues.createdAt;
    delete attendee.dataValues.updatedAt;

    res.json(attendee);
});

//Edit an Event specified by its id
router.put('/:eventId', requireAuth, async (req, res, next) => {
    const eventId = parseInt(req.params.eventId);
    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;

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
    event.save()

    delete event.dataValues.createdAt;
    delete event.dataValues.updatedAt;

    res.json(event);
});

//Get all Attendees of an Event specified by its id
router.get('/:eventId/attendees', async (req, res, next) => {
    const eventId = parseInt(req.params.eventId);
    const userId = req.user.id

    const event = await Event.findByPk(eventId, {
        attributes: ['groupId'],
        include: {
            model: User, as: 'Attendees',
            attributes: ['id', 'firstName', 'lastName']
        }
    })

    if (!event) {
        const err = new Error("Event couldn't be found");
        err.status = 404;
        return next(err)
    }

    const member = await Membership.findOne({
        where:{
            userId
        }
    })


    let groupId = event.dataValues.groupId
    let group = await Group.findByPk(groupId)



    const nonPendingAttendees = await Attendance.findAll({
        include: { model: User, as: 'Attendees' },
        where: {
            eventId,
            [Op.not]: [
                { status: 'pending' }
            ]
        }
    }, { raw: true });

    const allAttendees = await Attendance.findAll({
        attributes: [],
        include: {model: User, as: 'Attendees'}
    })

    if (group.dataValues.organizerId === userId || member.dataValues.status === 'co-host') {

        delete event.dataValues.groupId;

        for (let i = 0; i < event.dataValues.Attendees.length; i++) {

            console.log('inside the if conditional')
            delete event.dataValues.Attendees[i].Attendance.dataValues.EventId
            delete event.dataValues.Attendees[i].Attendance.dataValues.UserId
            delete event.dataValues.Attendees[i].Attendance.dataValues.eventId
            delete event.dataValues.Attendees[i].Attendance.dataValues.userId
            delete event.dataValues.Attendees[i].Attendance.dataValues.createdAt
            delete event.dataValues.Attendees[i].Attendance.dataValues.updatedAt
        }

        res.json(event);
    } else {

        let members = {
            Attendees: nonPendingAttendees.map(obj => {
                let user = obj.Attendees
                user.Attendance = obj.status
                return user;
        })
    }

    res.json(members);
    }

});

//Get details of an Event specified by its id
router.get('/:eventId', async (req, res, next) => {
    const eventId = parseInt(req.params.eventId);



    const event = await Event.findByPk(eventId, {
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [
            { model: User, as: 'Attendees' },
            { model: Group, attributes: { exclude: ['createdAt', 'updatedAt', 'organizerId', 'about', 'type'] } },
            { model: Venue, attributes: { exclude: ['createdAt', 'updatedAt', 'groupId'] } },
            { model: EventImage, as: 'EventImages', attributes: { exclude: ['createdAt', 'updatedAt', 'eventId'] } },
        ],
    });

    if (!event) {
        const err = new Error("Event couldn't be found");
        err.status = 404;
        return next(err)
    }

    event.dataValues.numAttending = event.Attendees.length;
    delete event.dataValues.Attendees

    res.json(event);
});

//Get All Events
router.get('/', async (req, res, next) => {
    const events = await Event.findAll({
        attributes: ['id', 'groupId', 'description', 'venueId', 'name', 'type', 'startDate', 'endDate']
    })

    for (let i = 0; i < events.length; i++) {

    let groupId = events[i].dataValues.groupId;
    const members = await Membership.findAll({
        where: {
            groupId,
        }
    })

    let eventId = events[i].dataValues.id

    let images = await EventImage.findAll({
        attributes: ['url'],
        where: {
            eventId,
            preview: true,
        }
    })

    let group = await Group.findByPk(groupId, {
        attributes: ['id', 'name', 'city', 'state']
    });

    let venueId = events[i].dataValues.venueId
    let venue = await Venue.findOne({
        attributes: ['id', 'city', 'state'],
        where: {
            id: venueId
        }
    })

    events[i].dataValues.numAttending = members.length
    events[i].dataValues.previewImage = images
    events[i].dataValues.Group = group
    events[i].dataValues.Venue = venue
    }

    const eventsArray = { Events: events };

    res.json(eventsArray);
});


//Delete attendance to an event specified by id
router.delete('/:eventId/attendance', requireAuth, async (req, res, next) => {
    const eventId = parseInt(req.params.eventId);
    const { memberId } = req.body;

    const member = await Membership.findByPk(memberId);

    const event = await Event.findByPk(eventId)
    const userId = member.dataValues.userId


    if (!event) {
        const err = new Error("Event couldn't be found");
        err.status = 404;
        return next(err)
    }

    const userAttendance = await Attendance.findOne({
        where: {
            userId,
            eventId
        }
    })

    if (!userAttendance) {
        const err = new Error("Attendance does not exist for this User");
        err.status = 404;
        return next(err)
    }

    await userAttendance.destroy();
    res.json({
        message: 'Successfully deleted attendance from event'
    });
})

//Delete an Event specified by its id
router.delete('/:eventId', requireAuth, async (req, res, next) => {
    const eventId = parseInt(req.params.eventId);

    const event = await Event.findByPk(eventId, {
        include: {
            model: Group
        }
    })

    if (!event) {
        const err = new Error("Event couldn't be found");
        err.status = 404;
        return next(err)
    }

    await event.destroy()
    res.json({
        message: "Successfully deleted"
    })
});






module.exports = router;
