"use strict";

import {loadData} from "./data.js";
import {createEmbed} from "./embedBuilder.js";
import {createRowWithSelectComponents} from "./componentBuilder.js";
import {eventEmoji} from "./events.js";

const wcaEvents = ["3x3", "2x2", "4x4", "5x5", "6x6", "7x7", "Megaminx", "Pyraminx", "Skewb", "Square one", "Clock"];
const bestCubesEvents = [...wcaEvents, "Non-WCA"];

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
					emoji: eventEmoji[eventName]
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
	let selectOptions = bestCubesEvents
		.map(eventName => {
			return {
				label: eventName,
				emoji: eventEmoji[eventName],
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

export {bestCubesEvents as events, bestCubesStringSelectCustomId, getBestCubes};
