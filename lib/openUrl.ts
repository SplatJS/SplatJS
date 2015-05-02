"use strict";

import platform = require("./platform");

/**
 * Open a url in a new window.
 * @alias Splat.openUrl
 * @param {string} url The url to open in a new window.
 */
var openUrl = (url: string) => {
	window.open(url);
};

if (platform.isEjecta()) {
	openUrl = (url) => {
		(<any>window).ejecta.openURL(url);
	};
}

export = openUrl;
