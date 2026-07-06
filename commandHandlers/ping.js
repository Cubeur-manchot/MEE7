"use strict";

import {Command} from "discord-commands-toolkit";

import createEmbed from "../embedBuilder.js";

const handlePingCommandInteraction = function(interaction) {
	return {
		embeds: [
			createEmbed(
				"Ping",
				"https://fr.wikipedia.org/wiki/Ping_(logiciel)",
				":ping_pong: Pong ! :ping_pong:",
				[]
			)
		]
	}
};

const pingCommand = new Command({
	name: "ping",
	description: "Répond avec pong. Permet de voir si le bot est bien connecté.",
	handleInteraction: handlePingCommandInteraction
});

export default pingCommand;
