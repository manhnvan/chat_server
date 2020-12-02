const users = [];

const addUser = ({ id, name, roomId }) => {
	console.log(name);
	name = name.trim().toLowerCase();

	const existingUser = users.find((user) => (user.roomId === user.name) === name);

	if (existingUser) {
		return { error: 'user name is taken' };
	}

	const user = { id, name, roomId };
	users.push(user);
	return { user };
};

const removeUser = (id) => {
	const index = users.findIndex((user) => user.id === id);
	if (index !== -1) {
		return users.splice(index, 1)[0];
	}
};

const getUser = (id) => {
	return users.find((user) => user.id === id);
};

const getUserInRoom = (roomId) => {
	users.filter((user) => user.roomId === roomId);
};

module.exports = {
	addUser,
	removeUser,
	getUser,
	getUserInRoom
};
