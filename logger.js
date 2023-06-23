"use strict";

const infoLog = infoMessage => {
	console.log(`${getDate()}[Info] ${infoMessage}`);
};

const warningLog = infoMessage => {
	console.log(`${getDate()}[Warning] ${infoMessage}`);
};

const errorLog = errorMessage => {
	console.error(`${getDate()}[Error] ${errorMessage}`);
};

const getDate = () => {
	let date = new Date();
	return `[${date.getFullYear()}-${getStringTwoDigits(date.getMonth() + 1)}-${getStringTwoDigits(date.getDate())} `
		+ `${getStringTwoDigits(date.getHours())}:${getStringTwoDigits(date.getMinutes())}:${getStringTwoDigits(date.getSeconds())}]`;
};

const getStringTwoDigits = value => `${value < 10 ? "0" : ""}${value}`;

export {infoLog, warningLog, errorLog};
