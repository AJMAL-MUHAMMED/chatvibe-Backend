const express = require("express");
const router = express.Router()
const { createChat, userChats, findChat } = require("../controllers/chat");
const { authUser } = require("../middlwares/auth");


router.post('/chat', authUser, createChat)
router.get('/chat/:userId', userChats)
// router.get('/chat/find/:firstId/:secondId', findChat)

module.exports = router