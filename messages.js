"use strict";

import logger from "./logger.js";

const updateInteractionMessage = (interaction, answer) => {
	interaction.update({
		content: answer.textContent,
		embeds: answer.embeds,
		components: answer.components
	})
	.catch(interactionUpdateError => logger.error(`Fail to update message after string select interaction : ${interactionUpdateError}`));
};

const sendMessageToChannel = (message, channel) => {
	channel.send({
		content: message.textContent,
		embeds: message.embeds,
		components: message.components
	})
	.catch(sendMessageError => logger.error(`Fail to send message : ${sendMessageError}`));
};

export {replyWithEmbedAndComponents, updateInteractionMessage, sendMessageToChannel};
