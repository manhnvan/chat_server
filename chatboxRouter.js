const route = require('express').Router();
const ChatBox = require('./models/Chatbox');
const Message = require('./models/Message');
const Customer = require('./models/Customer');
const Seller = require('./models/Seller');
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

route.post('/createChatbox', async (req, res, next) => {
	try {
		const { participants, topic, avatar, productId } = req.body
		const isExist = await ChatBox.findOne({
			participants: {
				$all: [...participants],
			},
			productId: productId
		})
		if (isExist) {
			return res.status(200).json({
				success: true, 
				msg: 'chatbox is already existed', 
				chatbox: isExist
			})
		} else {
			const chatbox = new ChatBox({participants, topic, avatar, productId});
			const newMessage = new Message({
				chatbox: chatbox._id, from: chatbox._id, sender: 'Admin', content: 'Hãy trao đổi với người bán để được thỏa thuận tốt nhất !!!', images: []
			});
			await newMessage.save()
			chatbox.lastMessage = newMessage._id;
			const savedChatbox = await chatbox.save();
			return res.status(200).json({
				success: true, 
				msg: 'created chatbox successfully', 
				chatbox: savedChatbox
			})
		}
	} catch (error) {
		console.log(error)
		return res.status(200).json({
			success: 200,
			msg: 'fail to create chatbox'
		});
	}
});

route.get('/participants/:chatboxId', async (req, res, next) => {
	try {
		const {chatboxId} = req.params
		const chatbox = await ChatBox.findById(chatboxId);
		const participants =  chatbox.participants;
		const peopleInChatbox = {};
		const customers = await Customer.find({
			_id: participants
		})
		const sellers = await Seller.find({
			_id: participants
		})
		const people = [...sellers, ... customers];
		people.forEach(person => {
			peopleInChatbox[person._id] = person
		})
		return res.status(200).json({
			success: true,
			msg: 'success',
			peopleInChatbox: peopleInChatbox
		})
	} catch (e) {
		console.log(e);
		return res.status(200).json({
			success: false,
			msg: 'fail to get participant infomation'
		});
	}
});

route.get('/:participant', async (req, res, next) => {
	try {
		const { participant } = req.params
		console.log(participant);
		const chatboxes = await ChatBox.find({
			participants: {
				$in: [ participant ]
			}
		}).populate('lastMessage')

		return res.status(200).json({
			success: true,
			msg: 'success',
			chatboxes: chatboxes
		})
		console.log(chatboxes);
	} catch (error) {
		console.log(error);
		return res.status(200).json({
			success: false,
			msg: 'fail to get chatboxes'
		});
	}
});

route.get('/message/:chatboxId/:page', async (req, res, next) => {
	try {
		const perPage = 10
		const { chatboxId, page } = req.params;
		const messages = await Message.find({
			chatbox: chatboxId
		})
			.sort({created: -1})
			.skip(page * perPage)
			.limit(perPage);
			Message.updateMany({chatbox: chatboxId}, {
				$set: {
					isRead: true
				}
			})
		return res.status(200).json({
			success: true,
			messages: messages.sort((a, b) => a.created - b.created)
		});
	} catch (error) {
		console.log(error);
		return res.status(200).json({ message: 'not found' });
	}
});

module.exports = route;
