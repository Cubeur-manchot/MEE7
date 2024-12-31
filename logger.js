"use strict";

const log = (logType, message) => console[logType.toLowerCase()](`${getDate()}[${logType}] ${message}`);

const infoLog = message => log("Info", message);
const warningLog = message => log("Warn", message);
const errorLog = message => log("Error", message);
const debugLog = message => log("Debug", message);

const getDate = () => {
	let date = new Date();
	return `[${date.getFullYear()}-${getStringTwoDigits(date.getMonth() + 1)}-${getStringTwoDigits(date.getDate())} `
		+ `${getStringTwoDigits(date.getHours())}:${getStringTwoDigits(date.getMinutes())}:${getStringTwoDigits(date.getSeconds())}]`;
};

const getStringTwoDigits = value => `${value < 10 ? "0" : ""}${value}`;

export {infoLog, warningLog, errorLog, debugLog};
