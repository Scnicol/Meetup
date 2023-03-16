const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group, User, GroupImage, Venue } = require('../../db/models');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const sequelize = require('sequelize');
const { Op } = require("sequelize");
const group = require('../../db/models/group');

//Add an Image to a Group based on the Group's id
router.post('/:groupId/images', requireAuth, async (req, res, next) => {
    let groupId = parseInt(req.params.groupId);
    const {url, preview} = req.body;

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

    res.json({ message: "Success"})
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

//Edit a Group, updates and returns an existing group
router.put('/:groupId', requireAuth, async (req, res, next) => {
    const groupId = parseInt(req.params.groupId);

    const {name, about, type, private, city, state} = req.body;

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

//Get all Groups by the Current User
router.get('/current', requireAuth, async (req, res, next) => {
    const currUserId = req.user.id;

    const currUserGroups = await User.findByPk(currUserId, {
        attributes: [],
        include: [
            {model: Group, as: "Groups"}
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
                attributes: ['id', 'groupId', 'address', 'city', 'state', 'lat', 'lng' ],
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

    const currGroup =await Group.findByPk(groupId, {
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
    currGroup.dataValues.numMembers = currGroup.Users.length;
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
        groups[i].dataValues.numMembers = groups[i].Users.length;
        delete groups[i].dataValues.Users
    }
    console.log(groups)

    res.json(groups);
});

module.exports = router;
