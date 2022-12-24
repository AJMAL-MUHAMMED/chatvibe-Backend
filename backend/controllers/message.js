const Message = require('../models/mesage')
const User = require('../models/User')

exports.addMessage = async (req, res) => {
    const { chatId, senderId, text } = req.body
    const message = new Message({
        chatId, senderId, text
    })
    try {
        const result = await message.save()
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json(error)
    }
}

exports.getMessages = async (req, res) => {
    const { chatId } = req.params
    try {
        const result = await Message.find({ chatId })
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json(error)
    }
}

exports.getUser = async (req, res) => {
    const  userId  = req.params.id
    console.log(userId);
    try {
        const data = await User.findById(userId)
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json(error)
    }
}