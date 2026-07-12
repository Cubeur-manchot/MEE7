"use strict";

import {commands} from "../eventHandler.js";
import {updateInteractionMessage} from "../messages.js";
import pblistCommand from "../commandHandlers/pblist.js";
import bestcubesCommand from "../commandHandlers/bestcubes.js";

const onMessageComponentInteraction = async interaction => {
	if (!interaction.isMessageComponent()) {
		return;
	}
	let command;
	let answer;
	switch (interaction.customId) {
		case "algOfTheDayStringSelectCustomId":
			command = commands.find(command => command.stringSelectCustomId === interaction.customId);
			answer = await command.method(interaction.values[0], interaction.message);
			break;
		default:
			command = [pblistCommand, bestcubesCommand].find(command => `${command.name}${process.env.STRINGSELECT_SUFFIX}` === interaction.customId);
			if (!command) {
				logger.warn(`No command found for customId ${interaction.customId}.`);
				return;
			}
			answer = await command.handleInteraction(interaction, new Map([[command.options[0].name, interaction.values[0]]]));
	};
	updateInteractionMessage(interaction, answer);
};

const updateInteractionMessage = async (interaction, answer) => {
	try {
		await interaction.update({
			content: answer.textContent,
			embeds: answer.embeds,
			components: answer.components
		});
	} catch (interactionMessageUpdateError) {
		logger.error(`Error while updating message after interaction : ${interactionMessageUpdateError.stack}`);
	}
};

export default onMessageComponentInteraction;
