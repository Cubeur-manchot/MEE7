"use strict";

import {loadData} from "./data.js";
import {createEmbed} from "./embedBuilder.js";

const bestCubeEmoji = {
	"2x2": "<:2x2x2:889220192842969148>",
	"3x3": "<:3x3solved:708049634349547531>",
	"4x4": "<:4x4x4:751139156863877251>",
	"5x5": "<:5x5x5:891306835401908334>",
	"6x6": "<:6x6x6:889220222664441856>",
	"7x7": "<:7x7x7:891308319778668544>",
	"megaminx": "<:megaminx:890558131569066014>",
	"pyraminx": "<:pyraminx:890558130923143178>",
	"skewb": "<:skewb:890558131183181824>",
	"square one": "<:squane:890558131594203146>",
	"clock": "<:clock:890558131694891008>",
};

const wcaEvents = ["3x3", "2x2", "4x4", "5x5", "6x6", "7x7", "Megaminx", "Pyraminx", "Skewb", "Square One", "Clock"];
const bestCubesSheetId = "14RKLrMwBD3VPjZfXhTy4hiMnq3_skEV8Jus7lctjtN0";
const bestCubesNewSheetId = "1UzGN5xEl-noA3JsEFC6HJL1TL9x7TuKGiDYa64WEd88";

const getBestCubes = async () => {
	let data = await loadData(bestCubesSheetId, "Meilleurs cubes");
	let bestCubes = {wca: [], nonWca: []};
	for (let lineIndex = 1; lineIndex < data.length; lineIndex++) {
		if (!data[lineIndex][0].startsWith("Event")) { // ignore header lines
			let emoji = bestCubeEmoji[data[lineIndex][0]];
			if (emoji) {
				bestCubes.wca.push({
					emoji: emoji,
					flagships: data[lineIndex][1]
				});
			} else {
				bestCubes.nonWca.push({
					eventName: data[lineIndex][0],
					flagships: data[lineIndex][1]
				});
			}
		}
	}
	let wcaFormattedList = bestCubes.wca
		.map(bestCube => `${bestCube.emoji} ${bestCube.flagships}`)
		.join("\n");
	let nonWcaFormattedList = bestCubes.nonWca
		.map(bestCube => `**${bestCube.eventName}** : ${bestCube.flagships}`)
		.join("\n");
	return createEmbed(
		"Meilleurs cubes",
		`https://docs.google.com/spreadsheets/d/${bestCubesSheetId}/edit?usp=sharing`,
		[
			{
				name: "WCA",
				value: wcaFormattedList
			}, {
				name: "Non-WCA",
				value: nonWcaFormattedList
			}
		]
	);
};

const getNewBestCubes = async (eventName = wcaEvents[0]) => {
	let data = await loadData(bestCubesNewSheetId, "Meilleurs cubes");
	data.shift(); // remove header line
	let parsedData = data
		.map(dataRaw => {
			let [eventName, model, price, information] = dataRaw;
			return eventName.length && model && model.length && price && price.length
				? {
					eventName: eventName,
					model: model,
					price: parseFloat(price.replace(/,/g, ".")),
					information: information,
					emoji: bestCubeEmoji[eventName]
				}
				: null;
		})
		.filter(raw => raw !== null);
	let embedFields = [];
	if (wcaEvents.includes(eventName)) {
		let filteredData = parsedData
			.filter(dataRaw => dataRaw.eventName === eventName)
			.sort((firstCube, secondCube) => secondCube.price - firstCube.price);
		for (let cube of filteredData) {
			embedFields.push({
				name: cube.model,
				value: [`__${cube.price}€__`, cube.information].join("\n"),
				inline: true
			});
		}
	} else {
		let filteredData = parsedData
			.filter(dataRaw => !wcaEvents.includes(dataRaw.eventName));
		for (let cube of filteredData) {
			embedFields.push({
				name: cube.eventName,
				value: [cube.model, `__${cube.price}€__`, cube.information].join("\n"),
				inline: true
			});
		}
	}
	return {
		embed: createEmbed(
			`Meilleurs cubes (${eventName})`,
			`https://docs.google.com/spreadsheets/d/${bestCubesNewSheetId}/edit?usp=sharing`,
			embedFields
		),
	};
};

export {wcaEvents, getBestCubes, getNewBestCubes};
