"use strict";

import Discord from "discord.js";

import {onReady, onMessage} from "./eventHandler.js";
import {infoLog, errorLog} from "./logger.js";

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

Mee7.login(process.env.TOKEN)
	.then(() => infoLog("MEE7 is logged in !"))
	.catch(failedLoginErrorMessage => errorLog(`MEE7 failed to login : ${failedLoginErrorMessage}`));
