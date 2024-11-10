"use strict";

const eventEmoji = {
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
	"OH": "🖐️",
	"3BLD": "<:3BLD:1125683042539802745>",
	"Non-WCA": "<:nonwca:1116831265551810651>"
};

const getCleanEventName = eventName => {
	let eventNameLowerCase = eventName.toLowerCase();
	if (
		["2", "3", "4", "5", "6", "7"]
		.map(cubeSize => new Array(2).fill(cubeSize))
		.map(array => array.join("x"))
		.includes(eventNameLowerCase)
	) {
		return eventNameLowerCase;
	}
	switch (eventNameLowerCase) {
		case "mega":
		case "pyra":
			eventNameLowerCase = `${eventNameLowerCase}minx`;
		case "megaminx":
		case "pyraminx":
		case "skewb":
		case "square one":
		case "clock":
			return `${eventNameLowerCase[0].toUpperCase()}${eventNameLowerCase.slice(1)}`;
		case "non-wca":
			return "Non-WCA";
		case "3bld":
		case "oh":
			return eventName.toUpperCase();
		default:
			return null; // unrecognized event name
	};
};

export {eventEmoji, getCleanEventName};
