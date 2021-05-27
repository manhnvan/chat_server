const mongoose = require('mongoose');

const ChatboxSchema = mongoose.Schema({
	participants: [
		mongoose.Schema.Types.ObjectId
	],
	avatar: String,
	topic: String,
	created: {
		type: Date,
		default: Date.now,
	},
	productId: mongoose.Schema.Types.ObjectId,
	lastMessage: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'message'
	}
});

module.exports = mongoose.model('chatbox', ChatboxSchema);
