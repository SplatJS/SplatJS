require("../vendor/FontLoader.js");

function FontLoader() {
	this.totalFonts = 0;
	this.loadedFonts = 0;
}
FontLoader.prototype.load = function(fontFamilies) {
	this.totalFonts += fontFamilies.length;

	var that = this;
	var loader = new window.FontLoader(fontFamilies, {
		"fontLoaded": function(fontFamily) {
			that.loadedFonts++;
		}
	});
	loader.loadFonts();
};
FontLoader.prototype.allLoaded = function() {
	return this.totalFonts == this.loadedFonts;
};

module.exports = FontLoader;
