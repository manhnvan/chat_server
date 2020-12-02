const app = require('express')();
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(bodyParser.json());
app.use(cors());
const http = require('http').createServer(app);
require('dotenv').config();
const mongoose = require('mongoose');
const Chatbox = require('./models/Chatbox');
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
		origin: 'https://localhost:3002',
		methods: [ 'GET', 'POST' ],
		allowedHeaders: [ 'my-custom-header' ],
		credentials: true
	}
});

const PORT = process.env.PORT || 3002;

const chatboxRouter = require('./chatboxRouter');
app.use('/', chatboxRouter);

io.on('connection', (socket) => {
	socket.on('join', ({ name, chatboxId }) => {
		socket.join(chatboxId);
	});

	socket.on('sendMessage', async (message) => {
		const { chatboxId, content, senderId, senderName } = message;
		console.log(message);
		await Chatbox.findByIdAndUpdate(message.chatboxId, {
			$push: {
				messages: {
					senderId,
					senderName,
					content
				}
			}
		});
		io.to(chatboxId).emit('message', message);
	});
	socket.on('disconnect', () => {
		console.log('user disconnected');
	});
});

http.listen(PORT, () => {
	console.log(`listening on *:${PORT}`);
});
