"use strict";

import {errorLog} from "./logger.js";

const replyWithSimpleMessage = (initialMessage, answerMessage) => replyMessage(initialMessage, answerMessage, null, null);

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
	.catch(replyMessageError => errorLog(`Fail to answer with message : ${replyMessageError}`));
};

const updateInteractionMessage = (interaction, answer) => {
	interaction.update({
		content: answer.textContent,
		embeds: answer.embeds,
		components: answer.components
	})
	.catch(interactionUpdateError => errorLog(`Fail to update message after string select interaction : ${interactionUpdateError}`));
};

const sendMessageToChannel = (message, channel) => {
	channel.send({
		content: message.textContent,
		embeds: message.embeds,
		components: message.components
	})
	.catch(sendMessageError => errorLog(`Fail to send message : ${sendMessageError}`));
};

export {replyWithSimpleMessage, replyWithEmbedAndComponents, updateInteractionMessage, sendMessageToChannel};
