"use strict";

import {createEmbed} from "./embedBuilder.js";

const getPong = () => {
	return {
		embeds: [
			createEmbed(
				"Ping",
				"https://fr.wikipedia.org/wiki/Ping_(logiciel)",
				":ping_pong: Pong ! :ping_pong:",
				[]
			)
		]
	};
};

export {getPong};
