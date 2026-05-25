"use strict";

const log = (logLevel, message) => console[logLevel](JSON.stringify({
	timestamp: new Date().toISOString(),
	level: logLevel,
	message
}));

const infoLog = message => log("info", message);
const warningLog = message => log("warn", message);
const errorLog = message => log("error", message);
const debugLog = message => log("debug", message);

export {infoLog, warningLog, errorLog, debugLog};
