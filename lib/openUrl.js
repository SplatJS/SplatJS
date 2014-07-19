"use strict";

var platform = require("./platform");

/**
 * Open a url in a new window.
 * @alias Splat.openUrl
 * @param {string} url The url to open in a new window.
 */
module.exports = function(url) {
	window.open(url);
};

if (platform.isEjecta()) {
	module.exports = function(url) {
		window.ejecta.openURL(url);
	};
}
