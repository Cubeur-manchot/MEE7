"use strict";

import {Command, SlashCommandStringOption} from "discord-commands-toolkit";

import getEventEmoji from "../eventEmojis.js";
import {loadTableData} from "../data.js";
import createEmbed from "../discordBuilders/embedBuilder.js";
import createRowWithSelectComponents from "../discordBuilders/componentBuilder.js";

const pbListEvents = process.env.PBLIST_EVENTS.split(",");

const pbListSheetId = process.env.PBLIST_SPREADSHEET_ID;

const handlePbListCommandInteraction = async function (interaction, options) {
	const eventName = options.get("event");
	const pbListData = await getPbListData(eventName);
	const embedFields = createEmbedFields(pbListData);
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

const getPbListData = async eventName => {
	const rawData = await loadTableData(pbListSheetId, "Liste des PB");
	const timeColumnNumber = rawData[0].findIndex(headerLabel => headerLabel === eventName);
	const parsedData = parseData(rawData, timeColumnNumber);
	const orderedData = orderByTimeAscending(parsedData);
	const filteredData = filterTop100(orderedData);
	return filteredData;
};

const parseData = ([, ...rows], timeColumnIndex) => rows
	.map(line => (
		line[0] && line[1] && line[2] && line[timeColumnIndex])
			? {
				member: {
					name: line[0],
					id: line[1],
					discordIdentifier: line[2]
				},
				time: {
					raw: line[timeColumnIndex],
					seconds: parseDurationSeconds(line[timeColumnIndex])
				}
			}
			: null)
	.filter(Boolean);

const parseDurationSeconds = duration =>
	typeof duration === "number"
		? duration
		: duration
			.split(":")
			.map(element => parseFloat(element))
			.reverse()
			.map((element, index) => element * Math.pow(60, index))
			.reduce((partialSum, currentPartialTimeSeconds) => partialSum + currentPartialTimeSeconds, 0);

const orderByTimeAscending = pbList =>
	pbList.sort((firstPbListElement, secondPbListElement) => {
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
