"use strict";

import {Command} from "discord-commands-toolkit";

import createEmbed from "../discordBuilders/embedBuilder.js";

const handleHelpCommandInteraction = function (interaction) {
	return {
		embeds: [
			createEmbed(
				"Aide",
				null,
				"Voici les commandes actuellement reconnues :",
				this.commandsHandler.applicationCommands.map(command => ({
					name: command.name,
					value: `</${command.name}:${command.id}> : ${command.description}`
				}))
			)
		]
	};
};

const helpCommand = new Command({
	name: "help",
	description: "Affiche cette aide.",
	handleInteraction: handleHelpCommandInteraction
});

export default helpCommand;
