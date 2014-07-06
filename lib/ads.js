"use strict";
/**
 * @namespace Splat.ads
 */

var platform = require("./platform");

if (platform.isEjecta()) {
	var adBanner = new window.Ejecta.AdBanner();

	var isLandscape = window.innerWidth > window.innerHeight;

	var sizes = {
		"iPhone": {
			"portrait": {
				"width": 320,
				"height": 50
			},
			"landscape": {
				"width": 480,
				"height": 32
			}
		},
		"iPad": {
			"portrait": {
				"width": 768,
				"height": 66
			},
			"landscape": {
				"width": 1024,
				"height": 66
			}
		}
	};

	var size = sizes[window.navigator.userAgent][isLandscape ? "landscape" : "portrait"];

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
		},
		/**
		 * The width of the ads that will show
		 * @alias Splat.ads#width
		 */
		"width": size.width,
		/**
		 * The height of the ads that will show
		 * @alias Splat.ads#height
		 */
		"height": size.height
	};
} else {
	module.exports = {
		"show": function() {},
		"hide": function() {},
		"width": 0,
		"height": 0,
	};
}
