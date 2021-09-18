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
				time: parseFloat(data[lineIndex][1])
			});
		}
	}
	PBList.sort((firstElement, secondElement) => {
		return secondElement.time - firstElement.time;
	});
	let maximumDigitCount = PBList.length < 10 ? 1 : PBList.length < 100 ? 2 : 3;
	let result = "__**Vos <:PB:369399684156096512> <:Single:369420530098372608> <:3x3solved:693841238461382739> :**__\n\n```js";
	let rank = PBList.length;
	for (let pb of PBList) {
		let rankDigits = rank < 10 ? 1 : rank < 100 ? 2 : 3;
		let supplementarySpaces = rankDigits === maximumDigitCount ? ""
			: " ".repeat(maximumDigitCount - rankDigits);
		result += `\n${rank}.${supplementarySpaces} ${pb.member} : ${pb.time}`;
		rank--;
	}
	result += "```";
	return result;
};

module.exports = {getPbList};
