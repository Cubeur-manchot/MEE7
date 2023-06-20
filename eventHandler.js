"use strict";

import Discord from "discord.js";

import {replyWithMessage, replyWithEmbedAndComponents} from "./messages.js";
import {pbListEvents, getPbList} from "./pbList.js";
import {events, bestCubesStringSelectCustomId, getBestCubes} from "./bestCubes.js";
import {getPong} from "./ping.js";
import {getHelp} from "./help.js";
import {errorLog, infoLog} from "./logger.js";

const prefix = "!";

const onReady = Mee7 => {
	Mee7.user.setPresence({
		activities: [{name: "filer un coup de main à MEE6", type: Discord.ActivityType.Playing}],
		status: "online",
	});
	infoLog("MEE7 is ready !");
};

const onMessage = async message => {
	if (!isMee7CommandMessage(message)) {
		return;
	}
	let [commandName, argument] = message.content
		.replace(new RegExp(`^${prefix}`), "")
		.split(/\s/g)
		.filter(word => word !== "");
	let matchingCommand = commands.find(command => command.name === commandName);
	if (!matchingCommand) {
		return;
	}
	if (matchingCommand.options) {
		if (argument) { // option is provided, check validity
			argument = `${argument[0].toUpperCase()}${argument.slice(1).toLowerCase()}`.replace("wca", "WCA");
			if (!matchingCommand.options.includes(argument)) {
				replyWithMessage(message, `:x: Erreur : Option "${argument}" incorrecte. Choix possibles : ${matchingCommand.options.join(", ")}.`);
			}
		} else { // default option
			argument = matchingCommand.options[0];
		}
	}
	replyWithEmbedAndComponents(message, await matchingCommand.method(argument));
};

const isMee7CommandMessage = message => {
	return message.content.startsWith(prefix)
		&& !message.author.bot;
};

const commands = [
	{
		name: "help",
		description: "Affiche cette aide.",
		method: getHelp
	},
	{
		name: "pblist",
		description: "Affiche la liste des PB single des membres du serveur, par event.",
		options: pbListEvents,
		method: getPbList
	},
	{
		name: "bestcubes",
		description: "Affiche la liste des meilleurs cubes du moment, par event.",
		options: events,
		method: getBestCubes
	},
	{
		name: "ping",
		description: "Répond avec pong. Permet de voir si le bot est bien connecté.",
		method: getPong
	}
];

const onInteraction = async interaction => {
	if (interaction.isMessageComponent()) {
		if (!isMee7Message(interaction.message)) {
			return;
		}
		if (interaction.customId === bestCubesStringSelectCustomId) {
			let interactionValue = interaction.values[0];
			let answer = await getBestCubes(interactionValue);
			interaction.update(answer)
			.catch(interactionUpdateError => errorLog(`Fail to update message after string select interaction : ${interactionUpdateError}`));
		}
	}
};

const isMee7Message = message => {
	return message.author.id === message.client.user.id;
};

export {commands, prefix, onReady, onMessage, onInteraction};
