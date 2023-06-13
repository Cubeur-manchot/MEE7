"use strict";

import {loadData} from "./data.js";
import {createEmbed} from "./embedBuilder.js";
import {createRowWithSelectComponents} from "./componentBuilder.js";

const bestCubeEmoji = {
	"2x2": "<:2x2x2:889220192842969148>",
	"3x3": "<:3x3solved:708049634349547531>",
	"4x4": "<:4x4x4:751139156863877251>",
	"5x5": "<:5x5x5:891306835401908334>",
	"6x6": "<:6x6x6:889220222664441856>",
	"7x7": "<:7x7x7:891308319778668544>",
	"Megaminx": "<:megaminx:1116824663125938266>",
	"Pyraminx": "<:pyraminx:890558130923143178>",
	"Skewb": "<:skewb:890558131183181824>",
	"Square one": "<:squane:890558131594203146>",
	"Clock": "<:clock:890558131694891008>",
	"Non-WCA": "<:nonwca:1116831265551810651>"
};

const wcaEvents = ["3x3", "2x2", "4x4", "5x5", "6x6", "7x7", "Megaminx", "Pyraminx", "Skewb", "Square one", "Clock"];
const events = [...wcaEvents, "Non-WCA"];

const bestCubesSheetId = "1UzGN5xEl-noA3JsEFC6HJL1TL9x7TuKGiDYa64WEd88";

const bestCubesStringSelectCustomId = "bestCubesStringSelectCustomId";

const getBestCubes = async eventName => {
	let data = await loadData(bestCubesSheetId, "Meilleurs cubes");
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
				name: "__" + cube.eventName + "__",
				value: `${cube.model}${" ".repeat(3)}(${cube.price}€)`,
				inline: true
			});
		}
	}
	let selectOptions = events
		.map(eventName => {
			return {
				label: eventName,
				emoji: bestCubeEmoji[eventName],
				value: eventName
			};
		});
	return {
		embeds: [createEmbed(
			`Meilleurs cubes (${eventName})`,
			`https://docs.google.com/spreadsheets/d/${bestCubesSheetId}/edit?usp=sharing`,
			null,
			embedFields
		)],
		components: createRowWithSelectComponents(selectOptions, eventName, bestCubesStringSelectCustomId)
	};
};

export {events, bestCubesStringSelectCustomId, getBestCubes};
