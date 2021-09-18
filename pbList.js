"use strict";

const {google} = require("googleapis");

const getPbList = async () => {
	let auth = new google.auth.GoogleAuth({
		keyFile: "credentials.json",
		scopes: "https://www.googleapis.com/auth/spreadsheets"
	});
	let data = (await google.sheets({version: "v4", auth: await auth.getClient()}).spreadsheets.values.get({
		auth: auth,
		spreadsheetId: "14RKLrMwBD3VPjZfXhTy4hiMnq3_skEV8Jus7lctjtN0",
		range: "Liste des PB"
	})).data.values;
	let PBList = [];
	for (let lineIndex = 1; lineIndex < data.length; lineIndex++) {
		if (data[lineIndex][0] && parseFloat(data[lineIndex][1])) { // check if both name and time exist and are non-empty
			PBList.push({
				member: data[lineIndex][0].replace(/'/g, "’"),
				time: data[lineIndex][1]
			});
		}
	}
	PBList.sort((firstElement, secondElement) => {
		return parseFloat(firstElement.time) - parseFloat(secondElement.time);
	});
	let embedFields = [];
	for (let groupsOfTen = 0; groupsOfTen >= 0; groupsOfTen += 10) {
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
	return {
		color: "#ffbf00",
		title: `<:PB:369399684156096512> <:Single:369420530098372608> <:3x3solved:693841238461382739>`,
		description: "Liste en ligne : <https://docs.google.com/spreadsheets/d/14RKLrMwBD3VPjZfXhTy4hiMnq3_skEV8Jus7lctjtN0/edit?usp=sharing>",
		fields: embedFields,
		timestamp: new Date()
	};
};

module.exports = {getPbList};
