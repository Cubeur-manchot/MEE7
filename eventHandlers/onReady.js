"use strict";

import Discord from "discord.js";
import logger from "../logger.js";

const onReady = discordClient => {
	discordClient.user.setPresence({
		activities: [{name: "filer un coup de main à MEE6", type: Discord.ActivityType.Playing}],
		status: "online",
	});
	logger.info("MEE7 is ready !");
	scheduleNextTickEvent(discordClient);
};

const scheduleNextTickEvent = discordClient => setTimeout(
	() => {
		discordClient.emit("tick", discordClient);
		scheduleNextTickEvent(discordClient);
	},
	new Date().setHours(24, 0, 0, 0) - new Date() // next day at 00:00 local time
);

export default onReady;
