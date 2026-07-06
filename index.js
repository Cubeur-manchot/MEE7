"use strict";

import Discord from "discord.js";
import {CommandsHandler} from "discord-commands-toolkit";

import logger from "./logger.js";
import {onInteraction} from "./eventHandler.js";
import onReady from "./onReady.js";
import onMessageComponentInteraction from "./onMessageComponentInteraction.js";
import pingCommand from "./commandHandlers/ping.js";
import helpCommand from "./commandHandlers/help.js";

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
	commands: [
		pingCommand,
		helpCommand
	],
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
