const mongoose = require('mongoose');

const ChatboxSchema = mongoose.Schema({
	members: {
		type: [ { id: mongoose.Schema.Types.ObjectId, name: String } ]
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
