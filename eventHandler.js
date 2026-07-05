"use strict";

import {replyWithEmbedAndComponents, updateInteractionMessage} from "./messages.js";
import {getCleanEventName} from "./events.js";
import {pbListEvents, pbListStringSelectCustomId, getPbList} from "./pbList.js";
import {bestCubesEvents, bestCubesStringSelectCustomId, getBestCubes} from "./bestCubes.js";
import {algOfTheDayStringSelectCustomId, getAlgOfTheDay} from "./algOfTheDay.js";
import {getPong} from "./ping.js";
import {getHelp} from "./help.js";

const commands = [
	{
		name: "help",
		description: "Affiche cette aide.",
		context: "slash",
		method: getHelp
	},
	{
		name: "pblist",
		description: "Affiche la liste des PB single des membres du serveur pour un event donné.",
		argument: {
			name: "event",
			description: "Choix de l'event",
			required: false,
			choices: pbListEvents
		},
		method: getPbList,
		stringSelectCustomId: pbListStringSelectCustomId
	},
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
	},
	{
		name: "ping",
		description: "Répond avec pong. Permet de voir si le bot est bien connecté.",
		method: getPong
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
