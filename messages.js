"use strict";

import {errorLog} from "./logger.js";

const replyWithMessage = (initialMessage, answerMessage) => {
	initialMessage.reply({
		content: answerMessage,
		allowedMentions: {
			repliedUser: false
		}
	})
	.catch(replyErrorMessage => errorLog(`Fail to answer with message : ${replyErrorMessage}`));
};

const replyWithEmbed = (initialMessage, answerEmbed) => {
	initialMessage.reply({
		embeds: [answerEmbed],
		allowedMentions: {
			repliedUser: false
		}
	})
	.catch(replyErrorMessage => errorLog(`Fail to answer with embed : ${replyErrorMessage}`));
};

export {replyWithMessage, replyWithEmbed};
