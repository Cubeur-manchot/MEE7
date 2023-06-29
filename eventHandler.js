"use strict";

import Discord from "discord.js";

import {replyWithMessage, replyWithEmbedAndComponents} from "./messages.js";
import {deploySlashCommands} from "./slashCommands.js";
import {pbListEvents, pbListStringSelectCustomId, getPbList} from "./pbList.js";
import {events, bestCubesStringSelectCustomId, getBestCubes} from "./bestCubes.js";
import {getPong} from "./ping.js";
import {getHelp} from "./help.js";
import {errorLog, infoLog} from "./logger.js";

const prefix = "!";

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
			choices: events
		},
		method: getBestCubes,
		stringSelectCustomId: bestCubesStringSelectCustomId
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
};

const treatCommand = (commandToReply, commandName, argument) => {
	let matchingCommand = commands.find(command => command.name === commandName);
	if (!matchingCommand) {
		return;
	}
	if (matchingCommand.argument) {
		if (argument) {
			argument = argument.toLowerCase().replace("wca", "WCA");
			if (argument.length > 4) { // long names
				argument = `${argument[0].toUpperCase()}${argument.slice(1)}`;
			}
			if (!matchingCommand.argument.choices.includes(argument)) {
				replyWithMessage(commandToReply, `:x: Erreur : Option "${argument}" incorrecte. Choix possibles : ${matchingCommand.argument.choices.join(", ")}.`);
				return;
			}
		} else {
			if (matchingCommand.argument.required) {
				replyWithMessage(commandToReply, `:x: Erreur : Option "${matchingCommand.argument.name}" manquante. Choix possibles : ${matchingCommand.argument.choices.join(", ")}.`);
				return;
			}
			argument = matchingCommand.argument.choices[0]; // default choice
		}
	}
	matchingCommand.method(argument)
	.then(answer => replyWithEmbedAndComponents(commandToReply, answer));
};

const onMessage = message => {
	if (!isMee7CommandMessage(message)) {
		return;
	}
	let [commandName, argument] = message.content
		.replace(new RegExp(`^${prefix}`), "")
		.split(/\s/g)
		.filter(word => word !== "");
	treatCommand(message, commandName, argument);
};

const isMee7CommandMessage = message => {
	return message.content.startsWith(prefix)
		&& !message.author.bot;
};

const onInteraction = interaction => {
	if (interaction.isMessageComponent()) {
		if (!isMee7Message(interaction.message)) {
			return;
		}
		let matchingCommand = commands.find(command => command.stringSelectCustomId === interaction.customId);
		if (!matchingCommand) {
			return;
		}
		matchingCommand.method(interaction.values[0])
		.then(answer =>
			interaction.update(answer)
			.catch(interactionUpdateError => errorLog(`Fail to update message after string select interaction : ${interactionUpdateError}`))
		);
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
