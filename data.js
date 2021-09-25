"use strict";

const {google} = require("googleapis");

const loadData = async tabName => {
	console.log("tab : " + tabName);
	let auth = new google.auth.GoogleAuth({
		keyFile: "credentials.json",
		scopes: "https://www.googleapis.com/auth/spreadsheets"
	});
	console.log("auth :");
	console.log(auth);
	return (await google.sheets({version: "v4", auth: await auth.getClient()}).spreadsheets.values.get({
		auth: auth,
		spreadsheetId: "14RKLrMwBD3VPjZfXhTy4hiMnq3_skEV8Jus7lctjtN0",
		range: tabName
	})).data.values;
};

module.exports = {loadData};
