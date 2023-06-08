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

const bestCubesSheetId = "14RKLrMwBD3VPjZfXhTy4hiMnq3_skEV8Jus7lctjtN0";

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

export {getBestCubes};
