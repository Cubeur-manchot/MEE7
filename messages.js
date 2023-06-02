"use strict";

import Discord from "discord.js";

const sendMessageToChannel = (channel, message, options) =>
	channel.send(message, options)
		.catch(console.error);

const sendEmbedToChannel = (channel, embedObject, attachments) =>
	sendMessageToChannel(channel, {embed: new Discord.MessageEmbed(embedObject), files: attachments});

export {sendMessageToChannel, sendEmbedToChannel};
