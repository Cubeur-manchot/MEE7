"use strict";

import logger from "./logger.js";

const sendMessageToChannel = (message, channel) => {
	channel.send({
		content: message.textContent,
		embeds: message.embeds,
		components: message.components
	})
	.catch(sendMessageError => logger.error(`Fail to send message : ${sendMessageError}`));
};

export {replyWithEmbedAndComponents, updateInteractionMessage, sendMessageToChannel};
