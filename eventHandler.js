"use strict";

import {replyWithEmbedAndComponents, updateInteractionMessage} from "./messages.js";
import {getCleanEventName} from "./events.js";
import {bestCubesEvents, bestCubesStringSelectCustomId, getBestCubes} from "./bestCubes.js";
import {algOfTheDayStringSelectCustomId, getAlgOfTheDay} from "./algOfTheDay.js";

const commands = [
	{
		name: "bestcubes",
		description: "Affiche la liste des meilleurs cubes du moment, par event.",
		argument: {
			name: "cube",
			description: "Choix du cube",
			required: false,
			choices: bestCubesEvents
		},
		method: getBestCubes,
		stringSelectCustomId: bestCubesStringSelectCustomId
	},
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
	if (matchingCommand.argument) {
		if (argument) {
			argument = getCleanEventName(argument) ?? argument;
		} else {
			argument = matchingCommand.argument.choices[0]; // default choice
		}
	}
	let answer = await matchingCommand.method(argument, commandToReply);
	replyWithEmbedAndComponents(commandToReply, answer);
};

const onInteraction = async interaction => {
	if (!interaction.isChatInputCommand()) {
		return;
	}
	let commandName = interaction.commandName;
	if (["ping", "help", "pblist"].includes(commandName)) {
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
