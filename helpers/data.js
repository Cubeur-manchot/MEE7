"use strict";

import {google} from "googleapis";

import logger from "../logger.js";

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

const writeTableCell = async (spreadsheetId, tabName, cellReference, value) => {
	try {
		logger.info(`Writing data to Google Sheets (spreadsheetId: ${spreadsheetId}, tab: ${tabName}, cell: ${cellReference}).`);
		await googleSheetsClient.spreadsheets.values.update({
			spreadsheetId: spreadsheetId,
			range: `${tabName}!${cellReference}`,
			valueInputOption: "USER_ENTERED", // keeps the text as provided, no automatic formatting
			requestBody: {values: [[value]]}
		});
		logger.info(`Data successfully written to Google Sheets (spreadsheetId: ${spreadsheetId}, tab: ${tabName}, cell: ${cellReference}).`);
	} catch (spreadsheetDataWritingError) {
		logger.error(`Error while writing data to Google Sheets (spreadsheetId: ${spreadsheetId}, tab: ${tabName}, cell: ${cellReference}): ${spreadsheetDataWritingError.stack}`);
		throw spreadsheetDataWritingError;
	}
};

const appendTableRow = async (spreadsheetId, tabName, rowValues) => {
	try {
		logger.info(`Appending a row to Google Sheets (spreadsheetId: ${spreadsheetId}, tab: ${tabName}).`);
		await googleSheetsClient.spreadsheets.values.append({
			spreadsheetId: spreadsheetId,
			range: tabName,
			valueInputOption: "USER_ENTERED",
			insertDataOption: "INSERT_ROWS",
			requestBody: {values: [rowValues]}
		});
		logger.info(`Row successfully appended to Google Sheets (spreadsheetId: ${spreadsheetId}, tab: ${tabName}).`);
	} catch (spreadsheetDataAppendingError) {
		logger.error(`Error while appending a row to Google Sheets (spreadsheetId: ${spreadsheetId}, tab: ${tabName}): ${spreadsheetDataAppendingError.stack}`);
		throw spreadsheetDataAppendingError;
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

export {loadTableData, writeTableCell, appendTableRow, loadJsonData};
