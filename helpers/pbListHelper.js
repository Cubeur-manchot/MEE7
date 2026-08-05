"use strict";

import {loadTableData, writeTableCell, appendTableRow} from "./data.js";

const pbListEvents = process.env.PBLIST_EVENTS.split(",");

const pbListSheetId = process.env.PBLIST_SPREADSHEET_ID;

const pbListTabName = "Liste des PB";

const getPb = async (userId, eventName) => {
	const data = await loadTableData(pbListSheetId, pbListTabName);
	const columnIndex = data[0].indexOf(eventName);
	const rowIndex = data.findIndex(row => row[1] === userId);
	const pb = rowIndex !== -1 && data[rowIndex][columnIndex]
		? parseOneRow(data[rowIndex].filter((_, index) => index <= 2 || index === columnIndex))
		: null;
	return {
		columnIndex,
		rowIndex,
		pb
	};
};

const getPbListData = async eventName =>
	(await loadTableData(pbListSheetId, pbListTabName))
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

const savePb = async (member, columnIndex, rowIndex, timeRaw) => {
	if (rowIndex !== -1) { // member already exists, update the cell
		const cellReference = `${String.fromCharCode(columnIndex + 65)}${rowIndex + 1}`;
		await writeTableCell(pbListSheetId, pbListTabName, cellReference, timeRaw);
	} else { // member does not exist, need to add it
		const newRow = [member.displayName, member.id, member.user.tag, ...Array(columnIndex - 3).fill(""), timeRaw];
		await appendTableRow(pbListSheetId, pbListTabName, newRow);
	}
};

export {pbListEvents, pbListSheetId, getPb, getPbListData, parseDurationSeconds, savePb};
