"use strict";

import Discord from "discord.js";
import {CommandsHandler} from "discord-commands-toolkit";

import {onInteraction} from "./eventHandler.js";
import onReady from "./onReady.js";
import onMessageComponentInteraction from "./onMessageComponentInteraction.js";
import logger from "./logger.js";

const Mee7 = new Discord.Client({
	intents: [
		Discord.GatewayIntentBits.Guilds,
		Discord.GatewayIntentBits.GuildMessages,
		Discord.GatewayIntentBits.MessageContent
	],
	partials: []
});

const commandHandler = new CommandsHandler({
	discordClient: Mee7,
	commands: [],
	logger
});

Mee7.once(Discord.Events.ClientReady, onReady);
Mee7.on(Discord.Events.InteractionCreate, onInteraction);
Mee7.on(Discord.Events.InteractionCreate, onMessageComponentInteraction);

try {
	await Mee7.login(process.env.TOKEN);
	logger.info("MEE7 is logged in !");
} catch (failedLoginErrorMessage) {
	logger.error(`MEE7 failed to login : ${failedLoginErrorMessage.stack}`);
}
