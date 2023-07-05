"use strict";

import {loadData} from "./data.js";
import {createEmbed} from "./embedBuilder.js";
import {createRowWithSelectComponents} from "./componentBuilder.js";
import {eventEmoji} from "./events.js";

const pbListEvents = process.env.EVENTS.split(",");

const pbListSheetId = "14RKLrMwBD3VPjZfXhTy4hiMnq3_skEV8Jus7lctjtN0";

const pbListStringSelectCustomId = "pbListStringSelectCustomId";

const getPbList = async eventName => {
	let data = await loadData(pbListSheetId, "Liste des PB");
	let timeColumnNumber = data[0].findIndex(headerLabel => headerLabel === eventName);
	let pbList = parseData(data, timeColumnNumber);
	pbList = removeDuplicates(pbList);
	pbList = orderByTimeAscending(pbList);
	pbList = filterTop100(pbList);
	let embedFields = createEmbedFields(pbList);
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

const parseData = (data, timeColumnIndex) => {
	let pbList = [];
	for (let lineIndex = 1; lineIndex < data.length; lineIndex++) {
		let [name, id, discordIdentifier] = data[lineIndex];
		let rawTime = data[lineIndex][timeColumnIndex];
		if (name && id && discordIdentifier && rawTime) {
			let timeSeconds = parseDurationSeconds(data[lineIndex][timeColumnIndex]);
			pbList.push({
				member: {
					name: name,
					id: id,
					discordIdentifier: discordIdentifier
				},
				time: {
					raw: rawTime,
					seconds: timeSeconds
				}
			});
		}
	}
	return pbList;
};

const parseDurationSeconds = duration => {
	switch (typeof duration) {
		case "number":
			return duration;
		case "string":
			return duration
				.split(":")
				.map(element => parseFloat(element))
				.reverse()
				.map((element, index) => element * Math.pow(60, index))
				.reduce((partialSum, currentPartialTimeSeconds) => partialSum + currentPartialTimeSeconds, 0);
	};
};

const removeDuplicates = pbList => { // todo : uncomment second unicity filter when all members have Discord unique identifier
	let uniqueIds = pbList
		.map(pbListElement => pbListElement.member.id)
		.filter((id, _, idArray) => idArray.indexOf(id) === idArray.lastIndexOf(id));
	/*let uniqueDiscordIdentifiers = pbList
		.map(pbListElement => pbListElement.member.discordIdentifier)
		.filter((memberDiscordIdentifier, _, discordIdentifierArray) => discordIdentifierArray.indexOf(memberDiscordIdentifier) === discordIdentifierArray.lastIndexOf(memberDiscordIdentifier));*/
	return pbList
		.filter(pbListElement => uniqueIds.includes(pbListElement.member.id))
		//.filter(pbListElement => uniqueDiscordIdentifiers.includes(pbListElement.member.discordIdentifier));
};

const orderByTimeAscending = pbList =>
	pbList.sort((firstPbListElement, secondPbListElement) => {
		return firstPbListElement.time.seconds - secondPbListElement.time.seconds;
	});

const filterTop100 = pbList =>
	pbList.slice(0, 100);

const createEmbedFields = pbList => pbList
	.reduce((partialResult, currentElement, currentIndex) => {
		let groupIndex = Math.floor(currentIndex / 10);
		(partialResult[groupIndex] = partialResult[groupIndex] || []).push(currentElement);
		return partialResult;
	}, [])
	.map((pbListGroup, pbListGroupIndex) => {
		return {
			name: `${pbListGroupIndex * 10 + 10}-${pbListGroupIndex * 10 + 1}`,
			value: [...pbListGroup
				.map((pbListElement, pbListElementIndex) => {
					let rank = pbListGroupIndex * 10 + pbListElementIndex + 1;
					return `\`${rank < 10 ? " " : ""}${rank}\` <@${pbListElement.member.id}> (${pbListElement.time.raw})`;
				})
				.reverse(),
				"\u200b"]
				.join("\n"),
			inline: true
		};
	})
	.reverse()
	.reduce((partialEmbedFieldsList, currentEmbedField, currentEmbedFieldIndex) => [
		...partialEmbedFieldsList,
		currentEmbedField,
		currentEmbedFieldIndex % 2
			? null
			: {
				name: "\u200b",
				value: "\u200b",
				inline: true
			}
		], [])
	.filter(embedField => embedField !== null);

export {pbListEvents, pbListStringSelectCustomId, getPbList};
