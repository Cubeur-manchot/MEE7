"use strict";

import Discord from "discord.js";

import {onReady, onMessage, onInteraction} from "./eventHandler.js";
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

Mee7.login(process.env.TOKEN)
	.then(() => logger.info("MEE7 is logged in !"))
	.catch(failedLoginErrorMessage => logger.error(`MEE7 failed to login : ${failedLoginErrorMessage}`));
