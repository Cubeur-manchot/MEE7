"use strict";

import Discord from "discord.js";

import {onMessage, onInteraction} from "./eventHandler.js";
import onReady from "./onReady.js";
import logger from "./logger.js";

const Mee7 = new Discord.Client({
	intents: [
		Discord.GatewayIntentBits.Guilds,
		Discord.GatewayIntentBits.GuildMessages,
		Discord.GatewayIntentBits.MessageContent
	],
	partials: []
});

Mee7.once(Discord.Events.ClientReady, onReady);
Mee7.on(Discord.Events.MessageCreate, onMessage);
Mee7.on(Discord.Events.InteractionCreate, onInteraction);

try {
	await Mee7.login(process.env.TOKEN);
	logger.info("MEE7 is logged in !");
} catch (failedLoginErrorMessage) {
	logger.error(`MEE7 failed to login : ${failedLoginErrorMessage.stack}`);
}
