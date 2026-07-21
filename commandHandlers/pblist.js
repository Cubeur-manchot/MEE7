"use strict";

import {Command, SlashCommandStringOption} from "discord-commands-toolkit";

import getEventEmoji from "../helpers/eventEmojis.js";
import {pbListEvents, pbListSheetId, getPbListData} from "../helpers/pbListHelper.js";
import createEmbed from "../discordBuilders/embedBuilder.js";
import createRowWithSelectComponents from "../discordBuilders/componentBuilder.js";

const handlePbListCommandInteraction = async function (interaction, options) {
	const eventName = options.get("event");
	const pbListData = await getPbListData(eventName);
	const orderedData = orderByTimeAscending(pbListData);
	const filteredData = filterTop100(orderedData);
	const embedFields = createEmbedFields(filteredData);
	const selectOptions = pbListEvents
		.map(eventName => {
			return {
				label: eventName,
				emoji: getEventEmoji(eventName),
				value: eventName
			};
		});
	return {
		embeds: [
			createEmbed(
				`Top 100 des PBs single des membres du serveur (${eventName})`,
				`https://docs.google.com/spreadsheets/d/${pbListSheetId}/edit?usp=sharing`,
				null,
				embedFields
			)
		],
		components: createRowWithSelectComponents(selectOptions, eventName, pbListStringSelectCustomId)
	};
};

const orderByTimeAscending = pbList => pbList.sort((firstPbListElement, secondPbListElement) => {
		return firstPbListElement.time.seconds - secondPbListElement.time.seconds;
	});

const filterTop100 = pbList =>
	pbList.slice(0, 100);

const createEmbedFields = pbList => pbList
	.reduce((partialResult, currentElement, currentIndex) => {
		const groupIndex = Math.floor(currentIndex / 10);
		(partialResult[groupIndex] = partialResult[groupIndex] || []).push(currentElement);
		return partialResult;
	}, [])
	.map((pbListGroup, pbListGroupIndex) => {
		return {
			name: `${pbListGroupIndex * 10 + 10}-${pbListGroupIndex * 10 + 1}`,
			value: [...pbListGroup
				.map((pbListElement, pbListElementIndex) => {
					const rank = pbListGroupIndex * 10 + pbListElementIndex + 1;
					return `\`${rank < 10 ? " " : ""}${rank}\` <@${pbListElement.member.id}> (${pbListElement.time.raw})`;
				})
				.reverse(),
				"\u200b"]
				.join("\n"),
			inline: true
		};
	})
	.reverse()
	.reduce((partialEmbedFieldsList, currentEmbedField, currentEmbedFieldIndex) => [
		...partialEmbedFieldsList,
		currentEmbedField,
		currentEmbedFieldIndex % 2
			? null
			: {
				name: "\u200b",
				value: "\u200b",
				inline: true
			}
		], [])
	.filter(embedField => embedField !== null);

const eventOption = new SlashCommandStringOption({
	name: "event",
	description: "Choix de l'event",
	required: true,
	choices: pbListEvents.map(eventName => ({name: eventName, value: eventName}))
});

const pbListCommand = new Command({
	name: "pblist",
	description: "Affiche la liste des PB single des membres du serveur pour un event donné.",
	handleInteraction: handlePbListCommandInteraction,
	options: [eventOption]
});

const pbListStringSelectCustomId = `${pbListCommand.name}${process.env.STRINGSELECT_SUFFIX}`;

export default pbListCommand;
