const express = require('express')
const router = express.Router()
const { addMessage, getMessages, getUser } = require('../controllers/message')
router.post('/message', addMessage)
router.get('/message/:chatId', getMessages)

module.exports = router