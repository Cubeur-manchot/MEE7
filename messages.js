"use strict";

import {errorLog} from "./logger.js";

const replyWithMessage = (initialMessage, answerMessage) => replyMessage(initialMessage, answerMessage, null, null);

const replyWithEmbed = (initialMessage, answerEmbed) => replyMessage(initialMessage, null, [answerEmbed], null);

const replyWithEmbedAndComponents = (initialMessage, answer) => replyMessage(initialMessage, null, answer.embeds, answer.components);

const replyMessage = (initialMessage, textContent, embeds, components) => {
	initialMessage.reply({
		content: textContent,
		embeds: embeds,
		components: components,
		allowedMentions: {
			repliedUser: false
		}
	})
	.catch(replyErrorMessage => errorLog(`Fail to answer with message : ${replyErrorMessage}`));
};

export {replyWithMessage, replyWithEmbed, replyWithEmbedAndComponents};
