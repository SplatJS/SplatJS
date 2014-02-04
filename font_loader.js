// require("./webfont.js");

function FontLoader() {
	this.totalFonts = 0;
	this.loadedFonts = 0;
}
FontLoader.prototype.load = function(fontFamilies) {
	this.totalFonts += fontFamilies.length;

	var that = this;
	window.WebFont.load({
		fontactive: function(familyName, fvd) {
			that.loadedFonts++;
		},
		custom: {
			families: fontFamilies
		}
	});
};
FontLoader.prototype.allLoaded = function() {
	return this.totalFonts == this.loadedFonts;
};

module.exports = FontLoader;
