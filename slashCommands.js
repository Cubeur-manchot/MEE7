"use strict";

import Discord from "discord.js";

import {commands} from "./eventHandler.js";
import {errorLog, warningLog, infoLog} from "./logger.js";

const deploySlashCommands = discordClient => {
	let slashCommands = buildSlashCommands();
	discordClient.rest.get(Discord.Routes.applicationCommands(discordClient.application.id))
	.then(currentCommands => {
		if (areCommandsSetsEqual(currentCommands, slashCommands)) {
			infoLog(
				"Mee7's commands are up to date, no need to redeploy them."
			);
		} else {
			infoLog(
				"Mee7's commands are not up to date, and should be redeployed."
			);
			deployCommands(discordClient, slashCommands);
		}
	})
	.catch(applicationCommandsGetError => {
		warningLog(
			`Fail to get Mee7's application commands :${applicationCommandsGetError}.`
		);
		deployCommands(discordClient, slashCommands);
	});
};

const buildSlashCommands = () => {
	return commands
		.map(command => {
			let slashCommand = new Discord.SlashCommandBuilder()
				.setDescription(command.description)
				.setName(command.name);
			if (command.argument) {
				slashCommand.addStringOption(option => {
					option
					.setName(command.argument.name)
					.setDescription(`${command.argument.description} : ${command.argument.choices.join(", ")}.`)
					.setRequired(command.argument.required)
					.addChoices(...command.argument.choices.map(choice => {return {name: choice, value: choice}}));
					return option;
				});
			}
			return slashCommand;
		});
};

const areCommandsSetsEqual = (currentCommands, newCommands) => {
	if (currentCommands.length !== newCommands.length) {
		return false;
	}
	currentCommands.sort((firstCommand, secondCommand) => firstCommand.name.localeCompare(secondCommand.name));
	newCommands.sort((firstCommand, secondCommand) => firstCommand.name.localeCompare(secondCommand.name));
	for (let commandIndex = 0; commandIndex < currentCommands.length; commandIndex++) {
		let currentCommand = currentCommands[commandIndex];
		let newCommand = newCommands[commandIndex];
		// check command
		if (currentCommand.name !== newCommand.name) {
			return false;
		}
		if (currentCommand.description !== newCommand.description) {
			return false;
		}
		if (currentCommand.options?.length || newCommand.options?.length) {
			// check command options
			if (!currentCommand.options?.length || !newCommand.options?.length
				|| currentCommand.options.length !== newCommand.options.length) {
				return false;
			}
			for (let commandOptionIndex = 0; commandOptionIndex < currentCommand.options.length; commandOptionIndex++) {
				let currentCommandOption = currentCommand.options[commandOptionIndex];
				let newCommandOption = newCommand.options[commandOptionIndex];
				if (currentCommandOption.name !== newCommandOption.name
					|| currentCommandOption.description !== newCommandOption.description) {
					return false;
				}
				if (currentCommandOption.required ^ newCommandOption.required) {
					return false;
				}
				if (currentCommandOption.choices?.length || newCommandOption.choices?.length) {
					// check command option choices
					if (!currentCommandOption.choices?.length || !newCommandOption.choices?.length
						|| currentCommandOption.choices.length !== newCommandOption.choices.length) {
						return false;
					}
					for (let optionChoiceIndex = 0; optionChoiceIndex < currentCommandOption.choices.length; optionChoiceIndex++) {
						let currentCommandOptionChoice = currentCommandOption.choices[optionChoiceIndex];
						let newCommandOptionChoice = newCommandOption.choices[optionChoiceIndex];
						if (currentCommandOptionChoice.name !== newCommandOptionChoice.name
							|| currentCommandOptionChoice.value !== newCommandOptionChoice.value) {
							return false;
						}
					}
				}
			}
		}
	}
	return true;
};

const deployCommands = (discordClient, slashCommands) => {
	discordClient.rest.put(
		Discord.Routes.applicationCommands(discordClient.application.id),
		{body: slashCommands.map(slashCommand => slashCommand.toJSON())}
	)
	.then(() => infoLog(
		"Mee7's commands have been deployed !"
	))
	.catch(applicationCommandsPutError => errorLog(
		`Fail to deploy Mee7's application commands : "${applicationCommandsPutError}".`
	));
};

export {deploySlashCommands};
