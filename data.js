"use strict";

import {google} from "googleapis";

const auth = new google.auth.GoogleAuth({
	scopes: [
		"https://www.googleapis.com/auth/spreadsheets",
		"https://www.googleapis.com/auth/drive.readonly"
	]
});

const authClient = await auth.getClient();

const loadTableData = async (spreadsheetId, tabName) => 
	(await google.sheets({version: "v4", auth: authClient}).spreadsheets.values.get({
		spreadsheetId: spreadsheetId,
		range: tabName
	})).data.values;

const loadJsonData = async fileId =>
	(await google.drive({version: "v3", auth: authClient}).files.get({
		fileId: fileId,
		alt: "media",
		responseType: "json" // result will be interpreted as object already parsed
	})).data;

export {loadTableData, loadJsonData};
