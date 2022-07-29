const express = require('express');
const authController = require('../controllers/auth');
const { passport } = require('../config/passport');

const router = express.Router();

/**
 *  @swagger
 *    tags:
 *        name: OAuth2
 *        description: API to handle authentication via google.
 */

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     tags: [OAuth2]
 *     description: Takes the user to the google authentication page
 *     responses:
 *       200:
 *         description: Redirects to google callback page then redirects the verified user to the home page.
 */
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email', 'openid'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/api/auth/google',
    session: false,
  }),
  authController.saveUserToTokenAndCookie
);

module.exports = router;
