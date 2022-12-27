const Chat = require('../models/chat')

exports.createChat = async (req, res) => {

    const check = await Chat.findOne({
        members: { $all: [req.body.senderId, req.body.receiverId] }
    });

    if (!check) {
        const newChat = new Chat({
            members: [req.body.senderId, req.body.receiverId]
        })
        try {
            const result = await newChat.save()
            res.status(200).json("ok");

        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }else{
        res.json('ok');
    }

}

exports.userChats = async (req, res) => {

    try {
        const chat = await Chat.find({
            members: { $in: [req.params.userId] }
        })
        console.log(chat,'kkkkk');
        res.status(200).json(chat)
    } catch (error) {
        res.status(500).json(error)
    }
}

exports.findChat = async (req, res) => {
    try {
        const chat = await Chat.findOne({
            members: { $all: [req.params.firstId, req.params.secondId] }
        })
        res.status(200).json(chat)
    } catch (error) {
        res.status(500).json(error)
    }
}