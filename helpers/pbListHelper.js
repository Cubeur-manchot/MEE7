"use strict";

import {loadTableData} from "./data.js";

const pbListEvents = process.env.PBLIST_EVENTS.split(",");

const pbListSheetId = process.env.PBLIST_SPREADSHEET_ID;

const getPbListData = async eventName =>
	(await loadTableData(pbListSheetId, "Liste des PB"))
		.map((row, rowIndex, rawData) =>
			row.filter((_, index) => index <= 2 || rawData[0][index] === eventName)) // keep columns 0, 1, 2, and the time for this event
		.filter(isNotHeader)
		.filter(isPbComplete)
		.map(parseOneRow);

const isNotHeader = (_, rowIndex) => rowIndex !== 0;

const isPbComplete = ([name, id, discordIdentifier, rawTime]) => name && id && discordIdentifier && rawTime;

const parseOneRow = ([name, id, discordIdentifier, rawTime]) => ({
	member: {name, id, discordIdentifier},
	time: {
		raw: rawTime,
		seconds: parseDurationSeconds(rawTime)
	}
});

const parseDurationSeconds = duration =>
	typeof duration === "number"
		? duration
		: duration
			.split(":")
			.map(element => parseFloat(element))
			.reverse()
			.map((element, index) => element * Math.pow(60, index))
			.reduce((partialSum, currentPartialTimeSeconds) => partialSum + currentPartialTimeSeconds, 0);

export {pbListEvents, pbListSheetId, getPbListData};
