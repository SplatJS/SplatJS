"use strict";
/**
 * @namespace Splat.ads
 */

import platform = require("./platform");

interface SizeInfo {
	[deviceName: string]: { [layout: string]: { width: number, height: number } }
}

var ads = {
	"show": (isAtBottom: boolean) => {},
	"hide": () => {},
	"width": 0,
	"height": 0,
};

if (platform.isEjecta()) {
	var adBanner = new (<any>window).Ejecta.AdBanner(); // TODO: Type info for Ejecta?

	var isLandscape = window.innerWidth > window.innerHeight;

	var sizes: SizeInfo = {
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

	var device = window.navigator.userAgent.indexOf("iPad") >= 0 ? "iPad" : "iPhone";
	var size = sizes[device][isLandscape ? "landscape" : "portrait"];

	ads = {
		/**
		 * Show an advertisement.
		 * @alias Splat.ads.show
		 * @param {boolean} isAtBottom true if the ad should be shown at the bottom of the screen. false if it should be shown at the top.
		 */
		"show": (isAtBottom) => {
			adBanner.isAtBottom = isAtBottom;
			adBanner.show();
		},
		/**
		 * Hide the current advertisement.
		 * @alias Splat.ads.hide
		 */
		"hide": () => adBanner.hide(),
		/**
		 * The width of the ad that will show.
		 * @alias Splat.ads#width
		 */
		"width": size.width,
		/**
		 * The height of the ad that will show.
		 * @alias Splat.ads#height
		 */
		"height": size.height
	};
}

export = ads;