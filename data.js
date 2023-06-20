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

const values = google.sheets({version: "v4", auth: await auth.getClient()}).spreadsheets.values;

const loadData = async (spreadsheetId, tabName) => {
	return (await values.get({
		auth: auth,
		spreadsheetId: spreadsheetId,
		range: tabName
	})).data.values;
};

export {loadData};
