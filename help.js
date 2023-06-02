"use strict";

import {events} from "./pbList.js";

const helpMessage = "`!help` : Affiche cette aide.\n\n"
    + "`!bestcubes` : affiche la liste des meilleurs cubes du moment.\n\n"
    + "`!pblist [event]` : affiche la liste des <:PB:369399684156096512> <:single:369420530098372608> des membres du serveur pour un event "
    + `(par défaut : <:3x3:693841238461382739>, events supportés : ${events.join(", ")}).`;

export {helpMessage};
