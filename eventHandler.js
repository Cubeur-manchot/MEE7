"use strict";

import Discord from "discord.js";
import fs from "fs";

import {replyWithMessage, replyWithEmbed} from "./messages.js";
import {getBestCubes} from "./bestCubes.js";
import {getPbList, pbListEvents} from "./pbList.js";
import {helpMessage} from "./help.js";
import {errorLog, infoLog} from "./logger.js";

const prefix = "!";

const CubeurManchotUserId = "217709941081767937";

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
			replyWithMessage(message, helpMessage);
			break;
		case "pblist":
			if (pbListEvents.includes(argument)) {
				replyWithEmbed(message, await getPbList(argument));
			} else {
				replyWithMessage(message, `:x: Erreur : Event ${argument} non reconnu/supporté. Choix possibles : ${pbListEvents.join(", ")}.`);
			}
			break;
		case "bestcubes":
			replyWithEmbed(message, await getBestCubes());
			break;
		case "restart":
			if (message.author.id === CubeurManchotUserId) {
				replyWithMessage(message, ":arrows_counterclockwise: Redémarrage...");
				throw "Restarting according to Cubeur-manchot's command...";
			} else {
				replyWithMessage(message, `:x: Erreur : Seul <@${CubeurManchotUserId}> est autoriser à me redémarrer.`);
			}
		case "ping":
			replyWithMessage(message, ":ping_pong: Pong ! :ping_pong:");
			break;
	}
};

export {onReady, onMessage};
