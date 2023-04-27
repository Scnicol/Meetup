const express = require('express');
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateLogin = [
    check('credential')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Please provide a valid email or username.'),
    check('password')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a password.'),
    handleValidationErrors
  ];

// Log in
router.post('/', validateLogin, async (req, res, next) => {
      const { credential, password } = req.body;
      //console.log(credential, password, 'backend login router')
      const user = await User.login({ credential, password });
      //console.log(user, 'USER---------BEFORE EDITS')
      if (!user) {
        const err = new Error('Login failed');
        err.status = 401;
        err.title = 'Login failed';
        err.errors = { message: 'Invalid credentials' };
        return next(err);
      }

      await setTokenCookie(res, user);

      delete user.dataValues.createdAt
      delete user.dataValues.updatedAt
      //console.log(user, 'USER---------AFTER EDITS')
      return res.json(
        user
      );
    }
  );

  // Log out
router.delete('/', (_req, res) => {
      res.clearCookie('token');
      return res.json({ message: 'success' });
    }
  );

  // Restore session user
router.get('/', restoreUser, (req, res) => {

      const { user } = req;

      if (user) {
        return res.json({
          user: user.toSafeObject()
        });
      } else return res.json({ user: null });
    }
  );

module.exports = router;
