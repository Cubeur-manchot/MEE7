"use strict";

import {Command, SlashCommandStringOption} from "discord-commands-toolkit";

import getEventEmoji from "../helpers/eventEmojis.js";
import {loadTableData} from "../data.js";
import createEmbed from "../discordBuilders/embedBuilder.js";
import createRowWithSelectComponents from "../discordBuilders/componentBuilder.js";

const bestCubesEvents = process.env.BESTCUBES_EVENTS.split(",");
const bestCubesWcaEvents = bestCubesEvents.filter(eventName => eventName !== "Non-WCA");

const bestCubesSheetId = process.env.BESTCUBES_SPREADSHEET_ID;

const handleBestCubesCommandInteraction = async (interaction, options) => {
	const eventName = options.get("event");
	const bestCubes = await getBestCubesData(eventName);
	const embedFields = bestCubesWcaEvents.includes(eventName)
		? createWcaEmbedFields(bestCubes, eventName)
		: createNonWcaEmbedFields(bestCubes);
	const selectOptions = bestCubesEvents
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
				`Meilleurs cubes (${eventName})`,
				`https://docs.google.com/spreadsheets/d/${bestCubesSheetId}/edit?usp=sharing`,
				null,
				embedFields
			)
		],
		components: createRowWithSelectComponents(selectOptions, eventName, bestCubesStringSelectCustomId)
	};
};

const getBestCubesData = async () => {
	const rawData = await loadTableData(bestCubesSheetId, "Meilleurs cubes");
	return rawData
		.map(([eventName, model, price, information]) => eventName?.length && model?.length && price?.length
			? {
				eventName,
				model,
				price: parseFloat(price.replace(/,/g, ".")),
				information
			}
			: null
		)
		.filter(Boolean);
};

const createWcaEmbedFields = (bestCubes, eventName) => bestCubes
	.filter(dataRaw => dataRaw.eventName === eventName)
	.sort((firstCube, secondCube) => secondCube.price - firstCube.price)
	.map(cube => ({
		name: cube.model,
		value: [`__${cube.price}€__`, cube.information].join("\n"),
		inline: true
	}));

const createNonWcaEmbedFields = bestCubes => bestCubes
	.slice(1) // remove header
	.filter(cube => !bestCubesWcaEvents.includes(cube.eventName))
	.map(cube => ({
		name: "__" + cube.eventName + "__",
		value: `${cube.model} (${cube.price}€)`,
		inline: true
	}));

const eventOption = new SlashCommandStringOption({
	name: "event",
	description: "Choix de l'event",
	required: true,
	choices: bestCubesEvents.map(eventName => ({name: eventName, value: eventName}))
});

const bestcubesCommand = new Command({
	name: "bestcubes",
	description: "Affiche la liste des meilleurs cubes du moment, par event.",
	handleInteraction: handleBestCubesCommandInteraction,
	options: [eventOption]
});

const bestCubesStringSelectCustomId = `${bestcubesCommand.name}${process.env.STRINGSELECT_SUFFIX}`;

export default bestcubesCommand;
