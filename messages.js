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
	.catch(replyErrorMessage => errorLog(`Fail to answer with message : ${replyErrorMessage}`));
};

export {replyWithSimpleMessage, replyWithEmbedAndComponents};
