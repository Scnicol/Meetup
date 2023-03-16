const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group, Membership, User, GroupImage } = require('../../db/models');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const sequelize = require('sequelize');
const { Op } = require("sequelize");

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
        console.log(groups[i].Users.length);
        groups[i].dataValues.numMembers = groups[i].Users.length;
        delete groups[i].dataValues.Users

        // groups[i].dataValues.GroupImages = groups[i].GroupImage;
        // delete groups[i].dataValues.GroupImage;
    }
    console.log(groups)

    res.json(groups);
});

module.exports = router;
