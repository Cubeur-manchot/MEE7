"use strict";

const {loadData} = require("./data.js");

const getPbList = async () => {
	let data = await loadData("Liste des PB");
	console.log("data :");
	console.log(data);
	let PBList = [];
	for (let lineIndex = 1; lineIndex < data.length; lineIndex++) {
		if (data[lineIndex][0] && parseFloat(data[lineIndex][1])) { // check if both name and time exist and are non-empty
			PBList.push({
				member: data[lineIndex][0].replace(/'/g, "’"),
				time: data[lineIndex][1]
			});
		}
	}
	console.log("PB list : " + PBList.length);
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
	console.log("embed fields : " + embedFields.length);
	return {
		color: "#ffbf00",
		title: "PB single des membres du serveur",
		url: "https://docs.google.com/spreadsheets/d/14RKLrMwBD3VPjZfXhTy4hiMnq3_skEV8Jus7lctjtN0/edit?usp=sharing",
		description: "",
		fields: embedFields,
		timestamp: new Date()
	};
};

module.exports = {getPbList};