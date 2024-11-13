"use strict";

import {google} from "googleapis";

const auth = new google.auth.GoogleAuth({
	credentials: Object.fromEntries(
		Object.entries(process.env)
			.filter(entry => entry[0].startsWith("CREDENTIALS_"))
			.map(entry => [entry[0].replace("CREDENTIALS_", ""), entry[1]])
	),
	scopes: "https://www.googleapis.com/auth/spreadsheets"
});

const authDrive = new google.auth.GoogleAuth({
	credentials: Object.fromEntries(
		Object.entries(process.env)
			.filter(entry => entry[0].startsWith("CREDENTIALS_"))
			.map(entry => [entry[0].replace("CREDENTIALS_", ""), entry[1]])
	),
	scopes: "https://www.googleapis.com/auth/drive.readonly"
});

const values = google.sheets({version: "v4", auth: await auth.getClient()}).spreadsheets.values;

const drive = google.drive({version: "v3", auth: await authDrive.getClient()});

const loadData = async (spreadsheetId, tabName) => {
	return (await values.get({
		auth: auth,
		spreadsheetId: spreadsheetId,
		range: tabName
	})).data.values;
};

const loadJsonData = async fileId => {
	return (await drive.files.get({
		fileId: fileId,
		alt: "media",
		responseType: "json" // result will be interpreted as object already parsed
	}));
};

export {loadData, loadJsonData};
