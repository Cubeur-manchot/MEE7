"use strict";

import {google} from "googleapis";

const loadData = async (spreadsheetId, tabName) => {
	let auth = new google.auth.GoogleAuth({
		keyFile: "credentials.json",
		scopes: "https://www.googleapis.com/auth/spreadsheets"
	});
	return (await google.sheets({version: "v4", auth: await auth.getClient()}).spreadsheets.values.get({
		auth: auth,
		spreadsheetId: spreadsheetId,
		range: tabName
	})).data.values;
};

export {loadData};
