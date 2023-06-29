"use strict";

import {loadData} from "./data.js";
import {createEmbed} from "./embedBuilder.js";
import {createRowWithSelectComponents} from "./componentBuilder.js";
import {eventEmoji} from "./eventsEmojis.js";

const pbListEvents = process.env.EVENTS.split(",");

const pbListSheetId = "14RKLrMwBD3VPjZfXhTy4hiMnq3_skEV8Jus7lctjtN0"

const pbListStringSelectCustomId = "pbListStringSelectCustomId";

const getPbList = async eventName => {
	let data = await loadData(pbListSheetId, `Liste des PB ${eventName}`);
	let PBList = [];
	for (let lineIndex = 1; lineIndex < data.length; lineIndex++) {
		if (data[lineIndex][0] && parseDurationSeconds(data[lineIndex][1])) { // check if both name and time exist and are non-empty
			PBList.push({
				member: data[lineIndex][0].replace(/'/g, "’"),
				time: data[lineIndex][1]
			});
		} else {
			throw `Error : Invalid format (sheet = Liste des PB ${eventName}, lineIndex = ${lineIndex}).`;
		}
	}
	PBList.sort((firstElement, secondElement) => {
		return parseDurationSeconds(firstElement.time) - parseDurationSeconds(secondElement.time);
	});
	let embedFields = [];
	for (let groupsOfTen = 0; groupsOfTen < 100 && groupsOfTen >= 0; groupsOfTen += 10) {
		let currentField = {
			name: `${groupsOfTen + 1}-${groupsOfTen + 10}`,
			value: "",
			inline: true
		};
		for (let unit = 0; unit < 10; unit++) {
			let rank = groupsOfTen + unit;
			if (PBList[rank] !== undefined) {
				currentField.value = `${rank + 1} - ${PBList[rank].member} (${PBList[rank].time})\n${currentField.value}`;
			} else {
				unit = 10;
				groupsOfTen = -11;
			}
		}
		if (currentField.value !== "") {
			currentField.value += "\n\u200b";
			embedFields.unshift(currentField);
			if (groupsOfTen % 20 === 0) { // add an empty field every two fields to keep only 2 columns
				embedFields.unshift({
					name: "\u200b",
					value: "\u200b",
					inline: true
				})
			}
		}
	}
	let selectOptions = pbListEvents
		.map(eventName => {
			return {
				label: eventName,
				emoji: eventEmoji[eventName],
				value: eventName
			};
		});
	return {
		embeds: [createEmbed(
			`PB single des membres du serveur (${eventName})`,
			`https://docs.google.com/spreadsheets/d/${pbListSheetId}/edit?usp=sharing`,
			null,
			embedFields
		)],
		components: createRowWithSelectComponents(selectOptions, eventName, pbListStringSelectCustomId)
	};
};

const parseDurationSeconds = durationString => {
	if (durationString.includes(":")) {
		let [minutes, seconds] = durationString.split(":");
		return parseFloat(minutes) * 60 + parseFloat(seconds);
	} else {
		return parseFloat(durationString);
	}
};

export {pbListEvents, pbListStringSelectCustomId, getPbList};
