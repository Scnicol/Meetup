const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group, User, GroupImage, Venue, Event, Membership } = require('../../db/models');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const sequelize = require('sequelize');
const { Op } = require("sequelize");
const groupimage = require('../../db/models/groupimage');


//Delete an image from a group by imageId
router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const imageId = parseInt(req.params.imageId);

    const image = await GroupImage.findByPk(imageId, {
        include: {
            model: Group
        }
    });
    if (!image) {
        const err = new Error("Group Image couldn't be found");
        err.status = 404;
        return next(err)
    }

    const groupId = image.dataValues.groupId
    const group = Group.findByPk(groupId);

    if (!group) {
        const err = new Error("Group couldn't be found");
        err.status = 404;
        return next(err)
    }


    await image.destroy();

    res.json({message: 'Successfully deleted'});
});









module.exports = router;
