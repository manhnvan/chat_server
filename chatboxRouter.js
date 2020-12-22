const route = require('express').Router();
const ChatBox = require('./models/Chatbox');
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
	const { authorization } = req.headers
	if (!authorization) {
		return res.status(401).json({
			message: 'Auth failed',
		})
	}
	const token = authorization.split(' ')[1];
	const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
	req.data = decoded
	req.role = decoded.role
	next()
}

route.post('/createChatbox', verifyToken, async (req, res, next) => {
	try {
		let { role } = req
		let ownerId = ''
		let ownerName = ''
		if (role === "OWNER") {
			ownerId = req.data._id
			ownerName = req.data.firstName + req.data.lastName
		} else {
			ownerId = req.body.ownerId
			ownerName = req.body.ownerName
		}
		const chatboxExisted = await ChatBox.findOne({ ownerId: ownerId });
		if (chatboxExisted) {
			return res.status(200).json({
				message: 'chat box is already existed'
			});
		} else {
			const chatBox = new ChatBox({ ownerId, ownerName });
			await chatBox.save();
			return res.status(200).json({
				message: 'create chatbox successfully'
			});
		}
	} catch (error) {
		console.log(error)
		return res.status(400).json({
			message: 'fail to create chatbox'
		});
	}
});

route.get('/', verifyToken, async (req, res, next) => {
	try {
		const { _id, firstName, lastName } = req.data
		const { role } = req
		let chatboxes = []
		if (role === "OWNER") {
			chatboxes = await ChatBox.find({ ownerId: _id }).select('_id ownerId ownerName');
			return res.status(200).json({
				count: chatboxes.length,
				chatboxes: chatboxes,
				userName: firstName + lastName,
				userId: _id,
				message: 'get chatbox successfully'
			});
		} else if (role === "ADMIN") {
			chatboxes = await ChatBox.find().select('_id ownerId ownerName');
			return res.status(200).json({
				count: chatboxes.length,
				chatboxes: chatboxes,
				userName: 'Admin',
				userId: '',
				message: 'get chatbox successfully'
			});
		}

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
