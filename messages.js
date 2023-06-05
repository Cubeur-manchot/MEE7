"use strict";

import Discord from "discord.js";
import {errorLog} from "./logger.js";

const sendMessageToChannel = (channel, message, options) =>
	channel.send(message, options)
		.catch(sendMessageErrorMessage => errorLog(`Fail to send message : ${sendMessageErrorMessage}`));

const sendEmbedToChannel = (channel, embedObject, attachments) =>
	sendMessageToChannel(channel, {embed: new Discord.MessageEmbed(embedObject), files: attachments});

export {sendMessageToChannel, sendEmbedToChannel};
