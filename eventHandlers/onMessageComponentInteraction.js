"use strict";

import {commands} from "../eventHandler.js";
import {updateInteractionMessage} from "../messages.js";

const onMessageComponentInteraction = async interaction => {
	if (!interaction.isMessageComponent()) {
		return;
	}
	let matchingCommand = commands.find(command => command.stringSelectCustomId === interaction.customId);
	if (!matchingCommand) {
		return;
	}
	let answer = await matchingCommand.method(interaction.values[0], interaction.message);
	updateInteractionMessage(interaction, answer);
};

export default onMessageComponentInteraction;
