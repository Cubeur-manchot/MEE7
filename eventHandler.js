"use strict";

const {sendMessageToChannel} = require("./messages.js");
const {getPbList} = require("./pbList.js");
const fs = require('fs');

const onReady = Mee7 => {
	Mee7.user.setActivity("filer un coup de main à MEE6")
		.then(() => console.log("MEE7 is ready !"))
		.catch(console.error);
	setupGoogleSheetsAPICredentials(Mee7);
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

const onMessage = async message => {
	if (message.content === "!pblist") {
		sendMessageToChannel(message.channel, await getPbList());
	}
};

module.exports = {onReady, onMessage};
