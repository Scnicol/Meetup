const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group, Membership, User} = require('../../db/models');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const sequelize = require('sequelize');
const { Op } = require("sequelize");

//Create a Group
router.post('/', requireAuth, async (req, res, next) => {
    const {name, about, type, private, city, state} = req.body;

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
    const groups = await Group.findAll({});
    const users = await User.findAll({});

    let count = 1;

    console.log(groups.length)
    for (let i = 0; i < groups.length; i++) {
        let currGroup = groups[i];
        console.log(currGroup.id)
    }

    res.json(groups);
});

module.exports = router;
