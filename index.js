"use strict";

const Discord = require("discord.js");

const {onReady, onMessage} = require("./eventHandler.js");

const Mee7 = new Discord.Client();

Mee7.on("ready", () => onReady(Mee7));
Mee7.on("message", onMessage);

Mee7.login(process.env.TOKEN)
	.then(() => console.log("MEE7 is logged in !"))
	.catch(console.error);
