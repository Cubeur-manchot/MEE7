"use strict";

const getEventEmoji = eventName => {
	switch(eventName) {
		case "2x2":        return "<:2x2x2:889220192842969148>";
		case "3x3":        return "<:3x3solved:708049634349547531>";
		case "4x4":        return "<:4x4x4:751139156863877251>";
		case "5x5":        return "<:5x5x5:891306835401908334>";
		case "6x6":        return "<:6x6x6:889220222664441856>";
		case "7x7":        return "<:7x7x7:891308319778668544>";
		case "Megaminx":   return "<:megaminx:1116824663125938266>";
		case "Pyraminx":   return "<:pyraminx:890558130923143178>";
		case "Skewb":      return "<:skewb:890558131183181824>";
		case "Square one": return "<:squane:890558131594203146>";
		case "Clock":      return "<:clock:890558131694891008>";
		case "OH":         return "🖐️";
		case "3BLD":       return "<:3BLD:1125683042539802745>";
		case "Non-WCA":    return "<:nonwca:1116831265551810651>";
		default: return null;
	};
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

export {getEventEmoji, getCleanEventName};
