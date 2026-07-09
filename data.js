"use strict";

import {google} from "googleapis";

import logger from "./logger.js";

const auth = new google.auth.GoogleAuth({
	scopes: [
		"https://www.googleapis.com/auth/spreadsheets",
		"https://www.googleapis.com/auth/drive.readonly"
	]
});

const authClient = await auth.getClient();

const googleSheetsClient = google.sheets({version: "v4", auth: authClient});

const googleDriveClient = google.drive({version: "v3", auth: authClient});

const loadTableData = async (spreadsheetId, tabName) => {
	try {
		logger.info(`Loading data from Google Sheets (spreadsheetId: ${spreadsheetId}, tab: ${tabName}).`);
		const data = (await googleSheetsClient.spreadsheets.values.get({
			spreadsheetId: spreadsheetId,
			range: tabName
		})).data.values;
		logger.info(`Data successfully loaded from Google Sheets (spreadsheetId: ${spreadsheetId}, tab: ${tabName}).`);
		return data;
	} catch (spreadsheetDataLoadingError) {
		logger.error(`Error while loading data from Google Sheets (spreadsheetId: ${spreadsheetId}, tab: ${tabName}): ${spreadsheetDataLoadingError.stack}`);
		throw spreadsheetDataLoadingError;
	}
};

const loadJsonData = async fileId => {
	try {
		logger.info(`Loading JSON data from Google Drive (fileId: ${fileId}).`);
		const data = (await googleDriveClient.files.get(
			{
				fileId: fileId,
				alt: "media"
			},
			{
				responseType: "json" // result will be interpreted as object already parsed
			}
		)).data;
		logger.info(`JSON data successfully loaded from Google Drive (fileId: ${fileId}).`);
		return data;
	} catch (driveJsonDataLoadingError) {
		logger.error(`Error while loading JSON data from Google Drive (fileId: ${fileId}): ${driveJsonDataLoadingError.stack}`);
		throw driveJsonDataLoadingError;
	}
};

export {loadTableData, loadJsonData};
