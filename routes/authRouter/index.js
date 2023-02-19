const express = require('express')
const router = express.Router()
const {body} = require('express-validator')
const {login } = require('../../controllers/Auth')

router.post('/login',[
    body(['email']).isEmail(),
    body(['password']).exists()
],login)

module.exports = router