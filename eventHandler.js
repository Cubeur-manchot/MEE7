"use strict";

import {replyWithEmbedAndComponents, updateInteractionMessage} from "./messages.js";
import {algOfTheDayStringSelectCustomId, getAlgOfTheDay} from "./algOfTheDay.js";

const commands = [
	{
		name: "algoftheday",
		description: "Donne l'algo du jour, par set.",
		method: getAlgOfTheDay,
		stringSelectCustomId: algOfTheDayStringSelectCustomId
	}
];

const treatCommand = async (commandToReply, commandName, argument) => {
	let matchingCommand = commands.find(command => command.name === commandName);
	if (!matchingCommand) {
		return;
	}
	let answer = await matchingCommand.method(argument, commandToReply);
	replyWithEmbedAndComponents(commandToReply, answer);
};

const onInteraction = async interaction => {
	if (!interaction.isChatInputCommand()) {
		return;
	}
	let commandName = interaction.commandName;
	if (["ping", "help", "pblist", "bestcubes"].includes(commandName)) {
		return;
	}
	let argument = commands
		.filter(command => command.argument)
		.map(command => command.argument.name)
		.map(commandArgument => interaction.options.get(commandArgument))
		.filter(interactionOption => interactionOption !== null)
		[0]
		?.value;
	treatCommand(interaction, commandName, argument);
};

export {commands, onInteraction};
