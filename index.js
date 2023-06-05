"use strict";

import Discord from "discord.js";

import {onReady, onMessage} from "./eventHandler.js";

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
	.then(() => console.log("MEE7 is logged in !"))
	.catch(console.error);
