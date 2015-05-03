/// <amd-dependency path="../vendor/FontLoader" />
"use strict";

import platform = require("./platform");

var fontLoader: { new (): FontLoader };

function buildFontFaceRule(family: string, urls: FontFamilyUrls) {
	var eot = urls["embedded-opentype"];
	var woff = urls.woff;
	var ttf = urls.truetype;
	var svg = urls.svg;

	var css = "\n";
	css += "@font-face {\n";
	css += "  font-family: \"" + family + "\";\n";
	css += "  src: url(\"" + eot + "\");\n";
	css += "  src: url(\"" + eot + "?iefix\") format(\"embedded-opentype\"),\n";
	css += "       url(\"" + woff + "\") format(\"woff\"),\n";
	css += "       url(\"" + ttf + "\") format(\"ttf\"),\n";
	css += "       url(\"" + svg + "\") format(\"svg\");\n";
	css += "}\n";
	return css;
}

function createCssFontFaces(fontFamilies: FontManifest) {
	var style = document.createElement("style");
	style.setAttribute("type", "text/css");
	var css = "";
	for (var family in fontFamilies) {
		if (fontFamilies.hasOwnProperty(family)) {
			css += buildFontFaceRule(family, fontFamilies[family]);
		}
	}
	style.appendChild(document.createTextNode(css));
	document.head.appendChild(style);
}

class FontLoader {
	/**
	 * The total number of fonts to be loaded.
	 * @member {number}
	 * @private
	 */
	totalFonts = 0;
	/**
	 * The number of fonts that have loaded completely.
	 * @member {number}
	 * @private
	 */
	loadedFonts = 0;
	
	/**
	 * Load fonts and lets you know when they're all available. An instance of FontLoader is available as {@link Splat.Game#fonts}.
	 * @constructor
	 */
	constructor() {
	}
	
	/**
	 * Load a font.
	 * @param {object} fontFamilies A key-value object that maps css font-family names to another object that holds paths to the various font files in different formats.
	 * @example
	game.fonts.load({
		"pixelade": {
			"embedded-opentype": "pixelade/pixelade-webfont.eot",
			"woff": "pixelade/pixelade-webfont.woff",
			"truetype": "pixelade/pixelade-webfont.ttf",
			"svg": "pixelade/pixelade-webfont.svg#pixeladeregular"
		}
	});
	 */
	load(fontFamilies: FontManifest) {
		createCssFontFaces(fontFamilies);
	
		var families: string[] = [];
		for (var family in fontFamilies) {
			if (families.hasOwnProperty(family)) {
				families.push(family);
			}
		}
		this.totalFonts += families.length;
	
		var self = this;
		var loader = new (<any>window).FontLoader(families, {
			"fontLoaded": function() {
				self.loadedFonts++;
			}
		});
		loader.loadFonts();
	}
	
	/**
	 * Test if all font fonts have loaded.
	 * @returns {boolean}
	 */
	allLoaded() {
		return this.totalFonts === this.loadedFonts;
	}
}

class EjectaFontLoader extends FontLoader {
	/**
	 * An alternate {@link FontLoader} when the game is running inside [Ejecta]{@link http://impactjs.com/ejecta}. You shouldn't need to worry about this.
	 * @constructor
	 * @private
	 */
	constructor() {
		super();
	}
	
	/**
	 * See {@link FontLoader#load}.
	 */
	load(fontFamilies: FontManifest) {
		for (var family in fontFamilies) {
			if (fontFamilies.hasOwnProperty(family)) {
				var fontPath = fontFamilies[family].truetype;
				if (fontPath) {
					(<any>window).ejecta.loadFont(fontPath);
				}
			}
		}
	}
	
	/**
	 * See {@link FontLoader#allLoaded}.
	 */
	allLoaded() {
		return true;
	}
}

if (platform.isEjecta()) {
	fontLoader = EjectaFontLoader;
} else {
	fontLoader = FontLoader;
}

export = fontLoader;