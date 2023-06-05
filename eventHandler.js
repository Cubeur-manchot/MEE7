"use strict";

import Discord from "discord.js"
import fs from "fs";

import {sendEmbedToChannel, sendMessageToChannel} from "./messages.js";
import {getPbList, events} from "./pbList.js";
import {getBestCubes} from "./bestCubes.js";
import {helpMessage} from "./help.js";
import {errorLog, infoLog} from "./logger.js";

const prefix = "!";

const onReady = Mee7 => {
	Mee7.user.setPresence({
		activities: [{name: "filer un coup de main à MEE6", type: Discord.ActivityType.Playing}],
		status: "online",
	});
	infoLog("MEE7 is ready !");
	setupGoogleSheetsAPICredentials();
};

const setupGoogleSheetsAPICredentials = () => {
	let credentials = {};
	for (let credentialProperty of Object.keys(process.env).filter(property => property.startsWith("CREDENTIALS_"))) {
		credentials[credentialProperty.replace("CREDENTIALS_", "")] = process.env[credentialProperty];
	}
	fs.writeFile(
		"credentials.json",
		JSON.stringify(credentials),
		writeFileError => {
			if (writeFileError) {
				errorLog(`Failed to write credentials : ${writeFileError}`);
				throw writeFileError;
			} else {
				infoLog("Google spreadsheets credentials file written successfully !")
			}
		}
	);
};

const isMee7CommandMessage = message => {
	return message.content.startsWith(prefix)
		&& !message.author.bot;
};

const onMessage = async message => {
	if (!isMee7CommandMessage(message)) {
		return;
	}
	let [commandName, argument] = message.content
		.replace(new RegExp(`^${prefix}`), "")
		.split(" ")
		.filter(word => word !== "");
	switch (commandName) {
		case "help":
			sendMessageToChannel(message.channel, helpMessage);
			break;
		case "pblist":
			if (events.includes(argument)) {
				sendEmbedToChannel(message.channel, await getPbList(argument));
			} else {
				sendMessageToChannel(message.channel,
					`:x: Erreur : Event ${argument} non reconnu/supporté. Choix possibles : ${events.join(", ")}.`);
			}
			break;
		case "bestcubes":
			sendEmbedToChannel(message.channel, await getBestCubes());
			break;
		case "restart":
			if (message.author.id === "217709941081767937") { // message sent by Cubeur-manchot
				sendMessageToChannel(message.channel, ":arrows_counterclockwise: Redémarrage...");
				throw "Restarting according to Cubeur-manchot's command...";
			} else {
				sendMessageToChannel(message.channel, ":x: Erreur : Seul <@217709941081767937> est autoriser à me redémarrer.");
			}
		case "ping":
			sendMessageToChannel(message.channel, ":ping_pong: Pong ! :ping_pong:");
			break;
	}
};

export {onReady, onMessage};
