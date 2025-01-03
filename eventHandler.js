"use strict";

import Discord from "discord.js";

import {replyWithSimpleMessage, replyWithEmbedAndComponents, updateInteractionMessage} from "./messages.js";
import {deploySlashCommands} from "./slashCommands.js";
import {getCleanEventName} from "./events.js";
import {pbListEvents, pbListStringSelectCustomId, getPbList} from "./pbList.js";
import {bestCubesEvents, bestCubesStringSelectCustomId, getBestCubes} from "./bestCubes.js";
import {algOfTheDayStringSelectCustomId, getAlgOfTheDay, scheduleNextAlgOfTheDay} from "./algOfTheDay.js";
import {getPong} from "./ping.js";
import {getHelp} from "./help.js";
import {infoLog} from "./logger.js";

const prefix = process.env.PREFIX;

const commands = [
	{
		name: "help",
		description: "Affiche cette aide.",
		method: getHelp
	},
	{
		name: "pblist",
		description: "Affiche la liste des PB single des membres du serveur, par event.",
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

const onReady = discordClient => {
	discordClient.user.setPresence({
		activities: [{name: "filer un coup de main à MEE6", type: Discord.ActivityType.Playing}],
		status: "online",
	});
	infoLog("MEE7 is ready !");
	deploySlashCommands(discordClient);
	scheduleNextAlgOfTheDay(discordClient);
};

const treatCommand = async (commandToReply, commandName, argument) => {
	let matchingCommand = commands.find(command => command.name === commandName);
	if (!matchingCommand) {
		return;
	}
	if (matchingCommand.argument) {
		if (argument) {
			argument = getCleanEventName(argument) ?? argument;
			if (!matchingCommand.argument.choices.includes(argument)) {
				replyWithSimpleMessage(commandToReply, `:x: Erreur : Option "${argument}" incorrecte. Choix possibles : ${matchingCommand.argument.choices.join(", ")}.`);
				return;
			}
		} else {
			if (matchingCommand.argument.required) {
				replyWithSimpleMessage(commandToReply, `:x: Erreur : Option "${matchingCommand.argument.name}" manquante. Choix possibles : ${matchingCommand.argument.choices.join(", ")}.`);
				return;
			}
			argument = matchingCommand.argument.choices[0]; // default choice
		}
	} else {
		if (argument) {
			replyWithSimpleMessage(commandToReply, `:x: Erreur : La commande "${matchingCommand.name}" n'attend pas d'option.`);
			return;
		}
	}
	let answer = await matchingCommand.method(argument, commandToReply);
	replyWithEmbedAndComponents(commandToReply, answer);
};

const onMessage = message => {
	if (!isMee7CommandMessage(message)) {
		return;
	}
	let [commandName, ...restOfTheMessage] = message.content
		.replace(new RegExp(`^${prefix}`), "")
		.split(/\s/g)
		.filter(word => word !== "");
	treatCommand(message, commandName, restOfTheMessage.join(" "));
};

const isMee7CommandMessage = message => {
	return message.content.startsWith(prefix)
		&& !message.author.bot;
};

const onInteraction = async interaction => {
	if (interaction.isMessageComponent()) {
		if (!isMee7Message(interaction.message)) {
			return;
		}
		let matchingCommand = commands.find(command => command.stringSelectCustomId === interaction.customId);
		if (!matchingCommand) {
			return;
		}
		let answer = await matchingCommand.method(interaction.values[0], interaction.message);
		updateInteractionMessage(interaction, answer);
	} else if (interaction.isChatInputCommand()) {
		if (!isInteractionForMee7Application(interaction)) {
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
	}
};

const isMee7Message = message => {
	return message.author.id === message.client.user.id;
};

const isInteractionForMee7Application = interaction => {
	return interaction.applicationId === interaction.client.application.id;
};

export {commands, prefix, onReady, onMessage, onInteraction};
