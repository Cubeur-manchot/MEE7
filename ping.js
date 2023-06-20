"use strict";

import {createEmbed} from "./embedBuilder.js";

const getPong = () => Promise.resolve({
	embeds: [
		createEmbed(
			"Ping",
			"https://fr.wikipedia.org/wiki/Ping_(logiciel)",
			":ping_pong: Pong ! :ping_pong:",
			[]
		)
	]
});

export {getPong};
