const route = require('express').Router();
const ChatBox = require('./models/Chatbox');

route.post('/createChatbox', async (req, res, next) => {
	try {
		console.log(req.body);
		const chatBox = new ChatBox({ ...req.body });
		await chatBox.save();
		return res.status(200).json({
			message: 'create chatbox successfully'
		});
	} catch (error) {
		return res.status(400).json({
			message: 'fail to create chatbox'
		});
	}
});

route.get('/:senderId', async (req, res, next) => {
	try {
		const { senderId } = req.params;
		const chatboxes = await ChatBox.find({ 'members._id': senderId }).select('_id members');
		return res.status(200).json({
			count: chatboxes.length,
			chatboxes: chatboxes,
			message: 'get chatbox successfully'
		});
	} catch (error) {
		console.log(error);
		return res.status(400).json({
			message: 'fail to get chatboxes'
		});
	}
});

route.get('/getChatbox/:chatboxId', async (req, res, next) => {
	try {
		const { chatboxId } = req.params;
		const chatbox = await ChatBox.findById(chatboxId);
		res.status(200).json(chatbox);
	} catch (error) {
		console.log(error);
		res.status(400).json({ message: 'not found' });
	}
});

module.exports = route;
