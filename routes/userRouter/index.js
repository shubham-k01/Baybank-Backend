const express = require('express')
const router = express.Router()
const User = require('../../models/User')
const fetchUser = require('../../middleware/fetchUser')
const {createUser,checkBal, transaction, allTransac , getInfo} = require('../../controllers/User')

router.route('/').post(createUser)
router.post('/fet',fetchUser,getInfo)
router.post('/checkbal',fetchUser,checkBal)
router.post('/tran',fetchUser,transaction)
router.post('/alltra',fetchUser,allTransac)

module.exports = router