"use strict";

import Discord from "discord.js";
import {errorLog} from "./logger.js";

const sendMessageToChannel = (channel, message, options) =>
	channel.send(message, options)
		.catch(sendMessageErrorMessage => errorLog(`Fail to send message : ${sendMessageErrorMessage}`));

const sendEmbedToChannel = (channel, embed) =>
	sendMessageToChannel(channel, {embeds: [embed]});

export {sendMessageToChannel, sendEmbedToChannel};
