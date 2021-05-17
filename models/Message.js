const mongoose = require('mongoose');

const ChatboxSchema = mongoose.Schema({
    chatbox: mongoose.Schema.Types.ObjectId,
    from: mongoose.Schema.Types.ObjectId,
    sender: String,
    content: String,
    images: [String],
	created: {
        type: Date,
        default: Date.now
    },
    isRead: {
        type: mongoose.Schema.Types.Boolean,
        default: false,
    }
});

module.exports = mongoose.model('message', ChatboxSchema);
