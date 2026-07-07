"use strict";

import Discord from "discord.js";
import {scheduleNextAlgOfTheDay} from "../algOfTheDay.js";
import logger from "../logger.js";

const onReady = discordClient => {
	discordClient.user.setPresence({
		activities: [{name: "filer un coup de main à MEE6", type: Discord.ActivityType.Playing}],
		status: "online",
	});
	logger.info("MEE7 is ready !");
	scheduleNextAlgOfTheDay(discordClient);
};

export default onReady;
