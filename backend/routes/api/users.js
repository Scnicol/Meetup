const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const validateSignup = [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Please provide a valid email.'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
  ];


// Sign up
router.post('/', validateSignup, async (req, res) => {
      const { firstName, lastName, username, email, password} = req.body;
      const user = await User.signup({firstName, lastName, username, email, password });
      let cookieToken = await setTokenCookie(res, user);

      delete user.dataValues.createdAt
      delete user.dataValues.updatedAt
      delete user.dataValues.username
      user.dataValues.token = cookieToken;

      return res.json(
        user
      );
    }
  );


module.exports = router;
