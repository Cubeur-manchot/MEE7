"use strict";

const sendMessageToChannel = (channel, message, options) =>
	channel.send(message, options)
		.catch(console.error);

module.exports = {sendMessageToChannel};
