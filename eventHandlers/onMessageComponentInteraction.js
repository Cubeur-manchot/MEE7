"use strict";

import pblistCommand from "../commandHandlers/pblist.js";
import bestcubesCommand from "../commandHandlers/bestcubes.js";
import {algOfTheDayStringSelectCustomId, getUpdatedAlgOfTheDay} from "../algOfTheDay.js";

const onMessageComponentInteraction = async interaction => {
	if (!interaction.isMessageComponent()) {
		return;
	}
	const answer = await getInteractionAnswer(interaction);
	updateInteractionMessage(interaction, answer);
};

const getInteractionAnswer = async interaction => {
	switch (interaction.customId) {
		case `${pblistCommand.name}${process.env.STRINGSELECT_SUFFIX}`:
			return await pblistCommand.handleInteraction(interaction, new Map([[pblistCommand.options[0].name, interaction.values[0]]]));
		case `${bestcubesCommand.name}${process.env.STRINGSELECT_SUFFIX}`:
			return await bestcubesCommand.handleInteraction(interaction, new Map([[bestcubesCommand.options[0].name, interaction.values[0]]]));
		case `${algOfTheDayStringSelectCustomId}${process.env.STRINGSELECT_SUFFIX}`:
			return getUpdatedAlgOfTheDay(interaction.values[0], interaction.message);
	}
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
