const app = require('express')();
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(bodyParser.json());
app.use(cors());
const http = require('http').createServer(app);
require('dotenv').config();
const mongoose = require('mongoose');
const Chatbox = require('./models/Chatbox');
const Message = require('./models/Message')
mongoose
	.connect(process.env.URI, {
		useUnifiedTopology: true,
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false
	})
	.then((res) => {
		console.log('connected');
	})
	.catch((error) => {
		console.log('error');
	});

const { addUser, removeUser, getUser, getUserInRoom } = require('./user');

var io = require('socket.io')(http, {
	cors: {
		origin: 'http://localhost:3002',
		methods: ['GET', 'POST'],
		allowedHeaders: ['my-custom-header'],
		credentials: true
	}
});

const PORT = process.env.PORT || 3002;

const chatboxRouter = require('./chatboxRouter');
app.use('/', chatboxRouter);

io.on('connection', (socket) => {
	socket.on('join', (chatboxId) => {
		console.log(`${chatboxId} has been connected`)
		socket.join(chatboxId);
	});

	socket.on('sendMessage', async (message) => {
		const { chatbox, content, sender, images, from } = message;
		console.log(message);
		const newMessage = new Message({
			chatbox, from, sender, content, images
		});
		const savedMessage = await newMessage.save();
		await Chatbox.findByIdAndUpdate(chatbox, {lastMessage: savedMessage._id });
		io.to(chatbox).emit('message', savedMessage);
	});
	socket.on('disconnect', () => {
		console.log('user disconnected');
	});
});

http.listen(PORT, () => {
	console.log(`listening on *:${PORT}`);
});
