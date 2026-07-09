"use strict";

import {commands} from "../eventHandler.js";
import {updateInteractionMessage} from "../messages.js";
import pblistCommand from "../commandHandlers/pblist.js";

const onMessageComponentInteraction = async interaction => {
	if (!interaction.isMessageComponent()) {
		return;
	}
	let command;
	let answer;
	switch (interaction.customId) {
		case "bestCubesStringSelectCustomId":
			command = commands.find(command => command.stringSelectCustomId === interaction.customId);
			answer = await command.method(interaction.values[0], interaction.message);
			break;
		case "algOfTheDayStringSelectCustomId":
			command = commands.find(command => command.stringSelectCustomId === interaction.customId);
			answer = await command.method(interaction.values[0], interaction.message);
			break;
		default:
			command = [pblistCommand].find(command => `${command.name}${process.env.STRINGSELECT_SUFFIX}` === interaction.customId);
			if (!command) {
				logger.warn(`No command found for customId ${interaction.customId}.`);
				return;
			}
			answer = await command.handleInteraction(interaction, new Map([[command.options[0].name, interaction.values[0]]]));
	};
	updateInteractionMessage(interaction, answer);
};

export default onMessageComponentInteraction;
