const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group, User, GroupImage, Venue, Event, Membership, EventImage } = require('../../db/models');
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
        const newMember = await Membership.create({
            userId,
            groupId,
            status: 'pending'
        });

        const foundMembership = await Membership.findOne({
            attributes: ['id'],
            where: {
                userId,
                groupId
            }
        })

        const newMemberPending = { memberId: foundMembership.dataValues.id, status: 'pending' }

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
    });

    delete groupEvent.dataValues.updatedAt
    delete groupEvent.dataValues.createdAt

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

    delete groupVenue.dataValues.updatedAt
    delete groupVenue.dataValues.createdAt

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

    delete newImage.dataValues.updatedAt
    delete newImage.dataValues.createdAt
    delete newImage.dataValues.groupId

    res.json(newImage);
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
    member.save()

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
    });
    group.save();

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

    let events = await Event.findAll({
        attributes: ['id', 'groupId', 'venueId', 'name', 'description', 'type', 'startDate', 'endDate'],
        where: {
            groupId
        }
    });

    const group = await Group.findByPk(groupId);

    if (!group) {
        const err = new Error("Group couldn't be found");
        err.status = 404;
        return next(err)
    }

    for (let i = 0; i < events.length; i++) {

        let groupId = events[i].dataValues.groupId;
        const members = await Membership.findAll({
            where: {
                groupId
            }
        })

        let eventId = events[i].dataValues.id

        let images = await EventImage.findAll({
            attributes: ['url'],
            where: {
                id: eventId
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


    res.json({Events: events});

});

//Get all Groups by the Current User
router.get('/current', requireAuth, async (req, res, next) => {
    const currUserId = req.user.id;

    const currUserGroups = await User.findByPk(currUserId, {
        attributes: [],
        include: [
            { model: Group, as: "Groups" }
        ]
    });

    for (let i = 0; i < currUserGroups.dataValues.Groups.length; i++) {
        let groupId = currUserGroups.dataValues.Groups[i].dataValues.id
        let membersOfGroup = await Membership.findAll({
            where: {
                groupId: groupId
            }
        });

        let imagesOfGroup = await GroupImage.findAll({
            attributes: ['url'],
            where:  {
                groupId: groupId,
                preview: true
            }
        })

        currUserGroups.dataValues.Groups[i].dataValues.numMembers = membersOfGroup.length
        currUserGroups.dataValues.Groups[i].dataValues.previewImage = imagesOfGroup

    }

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
    });

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

    let membersOfGroup = await Membership.findAll({
        where: {
            groupId: groupId
        }
    });

    let organizerId = currGroup.dataValues.organizerId;
    let organizer = await User.findOne({
        attributes: ['id', 'firstName', 'lastName'],
        where: {
            id: organizerId
        }
    })

    let venues = await Venue.findAll({
        attributes: ['id', 'groupId', 'address', 'city', 'state', 'lat', 'lng'],
        where: {
            groupId
        }
    })

    // should the user be considered a member or not? This will change how I create groups
    currGroup.dataValues.numMembers = membersOfGroup.length;
    currGroup.dataValues.Organizer = organizer;
    currGroup.dataValues.Venues = venues;
    delete currGroup.dataValues.User

    res.json(currGroup);
});

//Get all groups, include: numMembers, preview
router.get('/', async (req, res, next) => {
    const groups = await Group.findAll({
         attributes: {
         },
        include: [
            {
                model: User,
            },
            {
                model: GroupImage, as: "GroupImages",
                attributes: ['id', 'url', 'preview'],
            },
        ]
    });

    for (let i = 0; i < groups.length; i++) {
        let groupId = groups[i].dataValues.id
        let membersOfGroup = await Membership.findAll({
            where: {
                groupId: groupId
            }
        });

        let imagesOfGroup = await GroupImage.findAll({
            attributes: ['url'],
            where:  {
                groupId: groupId,
                preview: true
            }
        })

        groups[i].dataValues.numMembers = membersOfGroup.length
        groups[i].dataValues.previewImage = imagesOfGroup
        delete groups[i].dataValues.User
        delete groups[i].dataValues.GroupImages

    }
    res.json({Groups: groups});
});

//Delete a membership to a group specified by id
router.delete('/:groupId/membership', requireAuth, async (req, res, next) => {
    const groupId = parseInt(req.params.groupId);
    const { memberId } = req.body;


    const group = await Group.findByPk(groupId);

    if (!group) {
        const err = new Error("Group couldn't be found");
        err.status = 404;
        return next(err)
    }

    const member = await Membership.findByPk(memberId);

    if (!member) {
        const err = new Error("Member couldn't be found");
        err.status = 404;
        return next(err)
    }

    await member.destroy();
    res.json({
        message: 'Successfully deleted member from the group'
    });

})

//Delete a Group
router.delete('/:groupId', requireAuth, async (req, res, next) => {
    const groupId = parseInt(req.params.groupId);

    const group = await Group.findByPk(groupId);

    if (!group) {
        const err = new Error("Group couldn't be found");
        err.status = 404;
        return next(err)
    }

    await group.destroy()
    res.json({ message: "Successfully deleted" })
});

module.exports = router;
