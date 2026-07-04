"use strict";

class Logger {
	constructor() {
		this.info("Logger is ready.");
	};
	info = message => this.#log("info", message);
	warn = message => this.#log("warn", message);
	error = message => this.#log("error", message);
	debug = message => this.#log("debug", message);
	#log = (logLevel, message) => console[logLevel](JSON.stringify({
		timestamp: new Date().toISOString(),
		level: logLevel,
		message
	}));
};

export default new Logger();
