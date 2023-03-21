const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group, User, GroupImage, Venue, Event, Membership } = require('../../db/models');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const sequelize = require('sequelize');
const { Op } = require("sequelize");
const group = require('../../db/models/group');

//Request a new membership for a group specified by id.
router.post('/:groupId/membership', requireAuth, async (req, res, next) => {
    const groupId = parseInt(req.params.groupId);
    const userId = req.user.id;

    const group = await Group.findByPk(groupId, {
        attributes: [],
        include: [
            { model: Membership }
        ]
    });

    if (!group) {
        const err = new Error("Group couldn't be found");
        err.status = 404;
        return next(err)
    }

    const findMembership = await Membership.findOne({
        where: {
            userId,
            groupId
        }
    });

    if (!findMembership) {
        await Membership.create({
            userId,
            groupId,
            status: 'pending'
        });

        const foundMembership = await Membership.findOne({
            attributes: ['id', 'status'],
            where: {
                userId,
                groupId
            }
        });

        console.log({ id: userId })

        const newMemberPending = { id: userId, status: 'pending' }

        return res.json(newMemberPending);

    }
    if (findMembership.dataValues.status === 'pending') {
        const err = new Error("Membership has already been requested");
        err.status = 400;
        return next(err)
    }
    if (findMembership.dataValues.status === 'member') {
        const err = new Error("User is already a member of the group");
        err.status = 400;
        return next(err)
    }
});

//Create an Event for a Group specified by its id
router.post('/:groupId/events', requireAuth, async (req, res, next) => {
    const groupId = parseInt(req.params.groupId);
    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;

    const group = await Group.findByPk(groupId);

    if (!group) {
        const err = new Error("Group couldn't be found");
        err.status = 404;
        return next(err)
    }

    const groupEvent = await Event.create({
        groupId,
        venueId,
        name,
        type,
        capacity,
        price,
        description,
        startDate,
        endDate,
    })

    res.json(groupEvent);
})

//Create a new Venue for a Group specified by its id
router.post('/:groupId/venues', requireAuth, async (req, res, next) => {
    const groupId = parseInt(req.params.groupId);
    const { address, city, state, lat, lng } = req.body;

    const group = await Group.findByPk(groupId);


    if (!group) {
        const err = new Error("Group couldn't be found");
        err.status = 404;
        return next(err)
    }

    const groupVenue = await Venue.create({
        groupId,
        address,
        city,
        state,
        lat,
        lng,
    })

    res.json(groupVenue);
});

//Add an Image to a Group based on the Group's id
router.post('/:groupId/images', requireAuth, async (req, res, next) => {
    let groupId = parseInt(req.params.groupId);
    const { url, preview } = req.body;

    const currGroup = await Group.findByPk(groupId);

    if (!currGroup) {
        const err = new Error("Group couldn't be found");
        err.status = 404;
        return next(err)
    }

    const newImage = await GroupImage.create({
        groupId,
        url,
        preview,
    });

    res.json({ message: "Success" })
});

//Create a Group
router.post('/', requireAuth, async (req, res, next) => {
    const { name, about, type, private, city, state } = req.body;

    //get the id from the current user
    const organizerId = req.user.id;

    //create the new Group with the organizerId from the user.id
    const newGroup = await Group.create({
        organizerId,
        name,
        about,
        type,
        private,
        city,
        state,
    });



    res.status(201).json(newGroup);
});

//Change the status of a membership for a group specified by id
router.put('/:groupId/membership', requireAuth, async (req, res, next) => {
    const groupId = parseInt(req.params.groupId);
    const { memberId, status } = req.body;

    const group = await Group.findByPk(groupId);

    if (!group) {
        const err = new Error("Group couldn't be found");
        err.status = 400;
        return next(err)
    }

    const user = await User.findOne({
        include: { model: Membership },
        where: {
            id: memberId
        }
    })

    if (!user) {
        const err = new Error("User couldn't be found");
        err.status = 400;
        return next(err)
    }

    const member = await Membership.findOne({
        attributes: ['id', 'groupId', 'status'],
        // where: [
        //     {userId: memberId}
        // ]
    });

    if (!member) {
        const err = new Error("Membership between the user and the group does not exist");
        err.status = 400;
        return next(err)
    }

    if (status === 'pending') {
        const err = new Error("Cannot change a membership status to pending");
        err.status = 400;
        return next(err)
    }

    member.set({
        groupId,
        status,
    });

    member.dataValues.memberId = memberId;
    delete member.dataValues.createdAt;
    delete member.dataValues.updatedAt;

    res.json(member);

});

//Edit a Group, updates and returns an existing group
router.put('/:groupId', requireAuth, async (req, res, next) => {
    const groupId = parseInt(req.params.groupId);

    const { name, about, type, private, city, state } = req.body;

    let group = await Group.findByPk(groupId);

    if (!group) {
        const err = new Error("Group couldn't be found");
        err.status = 404;
        return next(err)
    }
    group.set({
        name,
        about,
        type,
        private,
        city,
        state,
    })

    res.json(group);
});

//Get all Members of a Group specified by its id
router.get('/:groupId/members', async (req, res, next) => {
    const groupId = parseInt(req.params.groupId);
    const user = req.user

    const group = await Group.findByPk(groupId, {
        attributes: ['organizerId'],
        include: [
            {
                model: User, as: 'Members',
                attributes: ['id', 'firstName', 'lastName', 'username']
            }
        ]
    });
    //error handler for not being able to find the group
    if (!group) {
        const err = new Error("Group couldn't be found");
        err.status = 404;
        return next(err)
    }

    const member = await Membership.findAll({
        where: {
            status: 'co-host',
            userId: user.id
        }
    })

    const pendingMembers = await Membership.findAll({
        include: { model: User, as: 'Members' },
        where: {
            groupId,
            [Op.not]: [
                { status: 'pending' }
            ]
        }
    }, { raw: true });

    if (group.dataValues.organizerId === user.id || member.dataValues.status === 'co-host') {

        const nonPendingMembers = await Group.findByPk(groupId, {
            attributes: [],
            include: {
                model: User, as: 'Members',
                attributes: ['id', 'firstName', 'lastName', 'username'],
            },
        });

        for (let i = 0; i < nonPendingMembers.dataValues.Members.length; i++) {
            console.log(nonPendingMembers.dataValues.Members[i].Membership.status);
            console.log('inside the if conditional')
            delete nonPendingMembers.dataValues.Members[i].Membership.dataValues.userId
            delete nonPendingMembers.dataValues.Members[i].Membership.dataValues.groupId
            delete nonPendingMembers.dataValues.Members[i].Membership.dataValues.createdAt
            delete nonPendingMembers.dataValues.Members[i].Membership.dataValues.updatedAt
        }


        res.json(nonPendingMembers);
    } else {

        let members = {
            Members: pendingMembers.map(obj => {
                let user = obj.Members
                user.Membership = obj.status
                return user;
            })
        }
        res.json(members);
    }


});

//Get All Events of a Group specified by its id
router.get('/:groupId/events', async (req, res, next) => {
    const groupId = parseInt(req.params.groupId);

    let group = await Group.findByPk(groupId, {
        attributes: [],
        include: { model: Event, as: "Events" }
    });

    if (!group) {
        const err = new Error("Group couldn't be found");
        err.status = 404;
        return next(err)
    }

    res.json(group);

});

//Get all Groups by the Current User
router.get('/current', requireAuth, async (req, res, next) => {
    const currUserId = req.user.id;

    const currUserGroups = await User.findByPk(currUserId, {
        attributes: [],
        include: [
            { model: Group, as: "Groups" }
        ]
    })
    res.json(currUserGroups);
});

//Get All Venues for a Group specified by it id
router.get('/:groupId/venues', requireAuth, async (req, res, next) => {
    const groupId = parseInt(req.params.groupId);

    const groupVenues = await Group.findByPk(groupId, {
        attributes: [],
        include: [
            {
                model: Venue, as: "Venues",
                attributes: ['id', 'groupId', 'address', 'city', 'state', 'lat', 'lng'],
            }
        ]
    })

    if (!groupVenues) {
        const err = new Error("Group couldn't be found");
        err.status = 404;
        return next(err)
    }
    res.json(groupVenues);
});

//Get details of a Group specified by its id
router.get('/:groupId', async (req, res, next) => {
    const groupId = parseInt(req.params.groupId);

    const currGroup = await Group.findByPk(groupId, {
        attributes: {
        },
        include: [
            { model: User },
            {
                model: GroupImage, as: "GroupImages",
                attributes: ['id', 'url', 'preview'],
            },
        ]
    });

    // should the user be considered a member or not? This will change how I create groups
    currGroup.dataValues.numMembers = currGroup.User.length;
    delete currGroup.dataValues.Users


    res.json(currGroup);
});

//Get all groups, include: numMembers, preview
router.get('/', async (req, res, next) => {
    const groups = await Group.findAll({
        attributes: {
        },
        include: [
            { model: User },
            {
                model: GroupImage, as: "GroupImages",
                attributes: ['id', 'url', 'preview'],
            },
        ]
    });

    for (let i = 0; i < groups.length; i++) {
        groups[i].dataValues.numMembers = groups[i].User.length;
        delete groups[i].dataValues.Users
    }


    res.json(groups);
});

module.exports = router;
