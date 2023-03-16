// backend/routes/api/index.js
const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');

//adding the groupsRouter to the index
const groupsRouter = require('./groups.js');

//adding the venuesRouter to the index
const venuesRouter = require('./venues.js');


const { restoreUser } = require("../../utils/auth.js");

router.use(restoreUser);

router.use('/session', sessionRouter);
router.use('/users', usersRouter);
//setting up the router for groups
router.use('/groups', groupsRouter);
//setting up the router for venues
router.use('/venues', venuesRouter);

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;
