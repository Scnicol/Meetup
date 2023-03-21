const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group, User, GroupImage, Venue, Event, EventImage, Attendance, Membership } = require('../../db/models');
const eventImages = require('../../db/models/eventimage');
const router = express.Router();
const { Op } = require("sequelize");

router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const imageId = parseInt(req.params.imageId);
    const image = await EventImage.findByPk(imageId, {
        include: {
            model: Event
        }
    });

    if (!image) {
        const err = new Error("Event Image couldn't be found");
        err.status = 404;
        return next(err)
    }

    await image.destroy()

    res.json({
        message: "Successfull deleted"
    })
});






module.exports = router;
