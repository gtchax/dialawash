const express = require('express');
const User = require('../models/user');
const authController = require('../controllers/auth');
const router = express.Router();
const {
    check,
    body
} = require('express-validator/check');

router.get('/login', authController.getLogin);
router.post('/logout', authController.postLogout);
router.get('/signup', authController.getSignup);
router.get('/reset', authController.getReset);
router.get('/new-password/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);
router.post('/reset', authController.postReset);
router.post('/signup', [check('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
    // .custom((value, {req}) => {
    //     return User.findOne({email: value})
    //         .then(userDoc => {
    //             if(userDoc) {
    //                 return Promise.reject('Email already exists, please try a different one!')
    //             }
    //         })
    // }),
    body('password', 'Please enter a passsword with at least 6 characters.')
    .isLength({
        min: 6
    })
    .trim(),
    body('phone', 'Please enter a valid mobile phone number. Format example: 0772345678')
    .isNumeric()
    .isLength({
        min: 9
    })
    .trim()
    .escape(),
    body('firstname')
    .trim()
    .escape(),
    body('lastname')
    .trim()
    .escape(),
    body('confirmpassword').trim().custom((value, {
        req
    }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords have to match!')
        }
        return true;
    })], authController.postSignup);
router.post('/login', [
    body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
    body('password').trim()
], authController.postLogin);

module.exports = router;