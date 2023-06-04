"use strict";

import {sendEmbedToChannel, sendMessageToChannel} from "./messages.js";
import {getPbList, events} from "./pbList.js";
import {getBestCubes} from "./bestCubes.js";
import {helpMessage} from "./help.js";
import fs from 'fs';

const prefix = "!";

const onReady = Mee7 => {
	Mee7.user.setActivity("filer un coup de main à MEE6")
		.then(() => console.log("MEE7 is ready !"))
		.catch(console.error);
	setupGoogleSheetsAPICredentials();
};

const setupGoogleSheetsAPICredentials = () => {
	fs.writeFile("credentials.json", JSON.stringify({
		type: process.env.CREDENTIALS_type,
		project_id: process.env.CREDENTIALS_project_id,
		private_key_id: process.env.CREDENTIALS_private_key_id,
		private_key: process.env.CREDENTIALS_private_key,
		client_email: process.env.CREDENTIALS_client_email,
		client_id: process.env.CREDENTIALS_client_id,
		auth_uri: process.env.CREDENTIALS_auth_uri,
		token_uri: process.env.CREDENTIALS_token_uri,
		auth_provider_x509_cert_url: process.env.CREDENTIALS_auth_provider_x509_cert_url,
		client_x509_cert_url: process.env.CREDENTIALS_client_x509_cert_url
	}), function (err) {
		if (err) {throw err;} else {console.log("Google spreadsheets credentials file written successfully !")}
	});
};

const isMee7CommandMessage = message => {
	return message.content.match(/^![A-Za-z]/);
};

const onMessage = async message => {
	if (isMee7CommandMessage(message)) {
		let command = message.content.substring(1).toLowerCase();
		if (command.startsWith("pblist")) {
			let event = command.split(" ").filter(word => word.length)[1] ?? "3x3";
			if (events.includes(event)) {
				sendEmbedToChannel(message.channel, await getPbList(event));
			} else {
				sendMessageToChannel(message.channel,
					`:x: Erreur : event ${event} non reconnu/supporté. Choix possibles : ${events.join(", ")}.`);
			}
		} else if (command === "bestcubes") {
			sendEmbedToChannel(message.channel, await getBestCubes());
		} else if (command === "restart") {
			if (message.author.id === "217709941081767937") { // message sent by Cubeur-manchot
				sendMessageToChannel(message.channel, ":arrows_counterclockwise: Redémarrage...");
				throw "Restarting according to Cubeur-manchot's command...";
			} else {
				sendMessageToChannel(message.channel, ":x: Seul <@217709941081767937> est autoriser à me redémarrer.");
			}
		} else if (command === "ping") {
			sendMessageToChannel(message.channel, ":ping_pong: Pong ! :ping_pong:");
		} else if (command === "help") {
			sendMessageToChannel(message.channel, helpMessage);
		}
	}
};

export {onReady, onMessage};
