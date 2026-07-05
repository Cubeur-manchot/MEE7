"use strict";

import logger from "./logger.js";

const replyWithEmbedAndComponents = (initialMessage, answer) => replyMessage(initialMessage, answer.textContent, answer.embeds, answer.components);

const replyMessage = (initialMessage, textContent, embeds, components) => {
	initialMessage.reply({
		content: textContent,
		embeds: embeds,
		components: components,
		allowedMentions: {
			repliedUser: false
		}
	})
	.catch(replyMessageError => logger.error(`Fail to answer with message : ${replyMessageError}`));
};

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
