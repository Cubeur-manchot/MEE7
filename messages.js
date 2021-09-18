"use strict";

const Discord = require("discord.js");

const sendMessageToChannel = (channel, message, options) =>
	channel.send(message, options)
		.catch(console.error);

const sendEmbedToChannel = (channel, embedObject, attachments) =>
	sendMessageToChannel(channel, {embed: new Discord.MessageEmbed(embedObject), files: attachments});

module.exports = {sendMessageToChannel, sendEmbedToChannel};
