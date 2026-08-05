"use strict";

import Discord from "discord.js";
import {Command, CommandContexts, SlashCommandStringOption} from "discord-commands-toolkit";

import {pbListEvents, getPb, parseDurationSeconds, savePb} from "../helpers/pbListHelper.js";
import getEventEmoji from "../helpers/eventEmojis.js";

const savepbCommandName = "savepb";

const pbListUpdaterRoleId = process.env.PBLIST_UPDATER_ROLE_ID;

const getEventNameFromChannelId = channelId => {
	switch (channelId) {
		case "353928758211903497": return "2x2";
		case "329918000553525258": return "3x3";
		case "336883248896671746": return "4x4";
		case "353504450867888128": return "3BLD";
		case "394571064224514048": return "OH";
		case "457655438880538625": return "Megaminx";
		case "424994640966451220": return "Square one";
		case "669511925167554580": return "Skewb";
		case "1522161055776641134": return "FTO";
		case "354866856055799818": return "Clock";
		case "394959073092698112":
		case "1532865977656545381": // channel on test server
			return "Pyraminx";
		default: return null; // either undefined, or the channel hosts multiple events (#big-cubes, #big-blind, #events-non-officiels, #cubing, ...)
	};
};

const handleSavepbCommandInteraction = async function (interaction, options) {
	if (interaction.isChatInputCommand()) {
		return await processPb.call(this, interaction.member, options.get("event"), options.get("time"));
	} else if (interaction.isMessageContextMenuCommand()) {
		const message = interaction.targetMessage;
		const targetMessageAuthor = interaction.targetMessage.member;
		if (targetMessageAuthor !== interaction.member && !interaction.member.roles.cache.has(pbListUpdaterRoleId)) {
			return getEphemeralErrorAnswer("Vous n'avez pas la permission de modifier le PB d'un autre membre.");
		}
		const eventName = getEventNameFromChannelId(interaction.channelId);
		if (!eventName) {
			return getEphemeralErrorUseSlashCommandAnswer.call(this, "Impossible de déterminer l'event.");
		}
		return await processPb.call(this, targetMessageAuthor, eventName, interaction.targetMessage.content);
	}
};

const processPb = async function (member, eventName, textContent) {
	const eventEmoji = getEventEmoji(eventName);
	const timeMatches = textContent.match(/(?:(?:(?:[1-5]\d|[1-9]):)?[0-5])?\d\.\d{2}/g) ?? [];
	if (timeMatches.length === 0) {
		return getEphemeralErrorUseSlashCommandAnswer.call(this, `${eventEmoji} Impossible de trouver un PB single, car le format fourni est invalide.`);
	}
	if (timeMatches.some(timeMatch => timeMatch !== timeMatches[0])) {
		return getEphemeralErrorUseSlashCommandAnswer.call(this, `${eventEmoji} Impossible de déterminer quel PB single enregistrer, car plusieurs correspondances ont été trouvées.`);
	}
	const newTimeRaw = timeMatches[0];
	const newTimeSeconds = parseDurationSeconds(newTimeRaw);
	const oldTime = (await getPb(member.id, eventName))[0]?.time;
	if (newTimeSeconds > oldTime?.seconds) {
		return getEphemeralErrorAnswer(`${eventEmoji} Le nouveau PB single ${newTimeRaw} est moins rapide que l'ancien ${oldTime.raw}.`);
	}
	try {
		await savePb(member, eventName, newTimeRaw);
		return getEphemeralAnswer(`${eventEmoji} Le nouveau PB single ${newTimeRaw} a été enregistré :white_check_mark:`);
	} catch (savePbError) {
		return getEphemeralErrorAnswer(`${eventEmoji} Une erreur est survenue lors de l'enregistrement du PB single ${newTimeRaw}.`);
	}
};

const getEphemeralErrorUseSlashCommandAnswer = function (message) {
	const savepbCommand = this.commandsHandler.guildApplicationCommands
		.get(process.env.GUILD_ID)
		.find(command => command.name === savepbCommandName);
	const pleaseUseSlashCommandLabel = `Veuillez utiliser la version slash command${savepbCommand ? ` : </${savepbCommand.name}:${savepbCommand.id}>` : ""}.`;
	return getEphemeralErrorAnswer(`${message} ${pleaseUseSlashCommandLabel}`);
};

const getEphemeralErrorAnswer = message => getEphemeralAnswer(`${message} Le PB n'a pas été enregistré :x:`);

const getEphemeralAnswer = message => ({
	content: message,
	flags: Discord.MessageFlags.Ephemeral
});

const eventOption = new SlashCommandStringOption({
	name: "event",
	description: "Choix de l'event",
	required: true,
	choices: pbListEvents.map(eventName => ({name: eventName, value: eventName}))
});

const timeOption = new SlashCommandStringOption({
	name: "time",
	description: "Temps du PB single",
	required: true
});

const savepbCommand = new Command({
	name: savepbCommandName,
	description: "Enregistre un PB single pour un event donné.",
	contexts: new CommandContexts({isSlashCommand: true, isMessageContextMenuCommand: true}),
	handleInteraction: handleSavepbCommandInteraction,
	options: [eventOption, timeOption]
});
export default savepbCommand;
