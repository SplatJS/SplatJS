"use strict";

require("../vendor/FontLoader.js");

function buildFontFaceRule(family, urls) {
	var eot = urls["embedded-opentype"];
	var woff = urls.woff;
	var ttf = urls.truetype;
	var svg = urls.svg;

	var css = "\n";
	css += "@font-face {\n";
	css += "  font-family: '" + family + "';\n";
	css += "  src: url('" + eot + "');\n";
	css += "  src: url('" + eot + "?iefix') format('embedded-opentype'),\n";
	css += "       url('" + woff + "') format('woff'),\n";
	css += "       url('" + ttf + "') format('ttf'),\n";
	css += "       url('" + svg + "') format('svg');\n";
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

function FontLoader() {
	this.totalFonts = 0;
	this.loadedFonts = 0;
}
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
FontLoader.prototype.allLoaded = function() {
	return this.totalFonts === this.loadedFonts;
};

function EjectaFontLoader() {
	this.totalFonts = 0;
	this.loadedFonts = 0;
}
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
EjectaFontLoader.prototype.allLoaded = function() {
	return true;
};

if (window.ejecta) {
	module.exports = EjectaFontLoader;
} else {
	module.exports = FontLoader;
}
