"use strict";
/**
 * @namespace Splat.ads
 */

var platform = require("./platform");

if (platform.isEjecta()) {
	var adBanner = new window.Ejecta.AdBanner();
	module.exports = {
		/**
		 * Show an advertisement.
		 * @alias Splat.ads.show
		 * @param {boolean} isAtBottom true if the ads should be shown at the bottom of the screen. false if it should be shown at the top
		 */
		"show": function(isAtBottom) {
			adBanner.isAtBottom = isAtBottom;
			adBanner.show();
		},
		/**
		 * Hide the current advertisement.
		 * @alias Splat.ads.hide
		 */
		"hide": function() {
			adBanner.hide();
		}
	};
} else {
	module.exports = {
		"show": function() {},
		"hide": function() {}
	};
}
