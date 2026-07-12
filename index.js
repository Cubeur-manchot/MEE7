"use strict";

import Discord from "discord.js";
import {CommandsHandler} from "discord-commands-toolkit";

import logger from "./logger.js";
import onReady from "./eventHandlers/onReady.js";
import onMessageComponentInteraction from "./eventHandlers/onMessageComponentInteraction.js";
import onTick from "./eventHandlers/onTick.js";
import pingCommand from "./commandHandlers/ping.js";
import helpCommand from "./commandHandlers/help.js";
import pblistCommand from "./commandHandlers/pblist.js";
import bestcubesCommand from "./commandHandlers/bestcubes.js";

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
		helpCommand,
		pblistCommand,
		bestcubesCommand
	],
	logger,
	guildIds: [process.env.GUILD_ID]
});

Mee7.once(Discord.Events.ClientReady, onReady);
Mee7.on(Discord.Events.InteractionCreate, onMessageComponentInteraction);
Mee7.on("tick", onTick);

try {
	await Mee7.login(process.env.TOKEN);
	logger.info("MEE7 is logged in !");
} catch (failedLoginErrorMessage) {
	logger.error(`MEE7 failed to login : ${failedLoginErrorMessage.stack}`);
}
