const express = require('express')
const router = express.Router()
const UserController = require('../controllers/UserController')
const authentication = require('../middleware/authentication')
const Speakeasy = require('speakeasy')

router.post('/register',UserController.register)
router.post('/login', UserController.login)
router.post('/generateOTP', UserController.GenereteOTP)
router.post('/validateOTP', UserController.validateOTP)
router.post('/resetPassword', UserController.resetPassword)

module.exports= router