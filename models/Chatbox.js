const mongoose = require('mongoose');

const ChatboxSchema = mongoose.Schema({
	ownerId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	ownerName: {
		type: String,
		required: true
	},
	messages: {
		type: [
			{
				senderId: mongoose.Schema.Types.ObjectId,
				content: String,
				senderName: String
			}
		],
		defautl: []
	}
});

module.exports = mongoose.model('chatbox', ChatboxSchema);
