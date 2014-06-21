"use strict";

require("../vendor/FontLoader.js");

function buildFontFaceRule(family, urls) {
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

function createCssFontFaces(fontFamilies) {
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

/**
 * Load fonts and lets you know when they're all available. An instance of FontLoader is available as {@link Splat.Game#fonts}.
 * @constructor
 */
function FontLoader() {
	/**
	 * The total number of fonts to be loaded.
	 * @member {number}
	 * @private
	 */
	this.totalFonts = 0;
	/**
	 * The number of fonts that have loaded completely.
	 * @member {number}
	 * @private
	 */
	this.loadedFonts = 0;
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
FontLoader.prototype.load = function(fontFamilies) {
	createCssFontFaces(fontFamilies);

	var families = [];
	for (var family in fontFamilies) {
		if (families.hasOwnProperty(family)) {
			families.push(family);
		}
	}
	this.totalFonts += families.length;

	var self = this;
	var loader = new window.FontLoader(families, {
		"fontLoaded": function() {
			self.loadedFonts++;
		}
	});
	loader.loadFonts();
};
/**
 * Test if all font fonts have loaded.
 * @returns {boolean}
 */
FontLoader.prototype.allLoaded = function() {
	return this.totalFonts === this.loadedFonts;
};

/**
 * An alternate {@link FontLoader} when the game is running inside [Ejecta]{@link http://impactjs.com/ejecta}. You shouldn't need to worry about this.
 * @constructor
 * @private
 */
function EjectaFontLoader() {
	this.totalFonts = 0;
	this.loadedFonts = 0;
}
/**
 * See {@link FontLoader#load}.
 */
EjectaFontLoader.prototype.load = function(fontFamilies) {
	for (var family in fontFamilies) {
		if (fontFamilies.hasOwnProperty(family)) {
			var fontPath = fontFamilies[family].truetype;
			if (fontPath) {
				window.ejecta.loadFont(fontPath);
			}
		}
	}
};
/**
 * See {@link FontLoader#allLoaded}.
 */
EjectaFontLoader.prototype.allLoaded = function() {
	return true;
};

if (window.ejecta) {
	module.exports = EjectaFontLoader;
} else {
	module.exports = FontLoader;
}
