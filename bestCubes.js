"use strict";

const {loadData} = require("./data.js");

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

const getBestCubes = async () => {
	let data = await loadData("Meilleurs cubes");
	console.log("data :");
	console.log(data);
	let bestCubes = {wca: [], nonWca: []};
	for (let lineIndex = 1; lineIndex < data.length; lineIndex++) {
		console.log(data[lineIndex]);
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
	let wcaFormattedList = "";
	for (let bestCube of bestCubes.wca) {
		wcaFormattedList += `\n${bestCube.emoji} ${bestCube.flagships}`;
	}
	wcaFormattedList = wcaFormattedList.substring(1); // remove first line return
	let nonWcaFormattedList = "";
	for (let bestCube of bestCubes.nonWca) {
		nonWcaFormattedList += `\n${bestCube.eventName} : ${bestCube.flagships}`;
	}
	nonWcaFormattedList = nonWcaFormattedList.substring(1); // remove first line return
	return {
		color: "#ffbf00",
		title: "Meilleurs cubes",
		url: "https://docs.google.com/spreadsheets/d/14RKLrMwBD3VPjZfXhTy4hiMnq3_skEV8Jus7lctjtN0/edit?usp=sharing",
		fields: [
			{
				name: "WCA",
				value: wcaFormattedList
			}, {
				name: "Non-WCA",
				value: nonWcaFormattedList
			}
		],
		timestamp: new Date()
	};
};

module.exports = {getBestCubes};
