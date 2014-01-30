var Splat = (function(splat, window) {

	function FontLoader() {
		this.totalFonts = 0;
		this.loadedFonts = 0;
	}
	FontLoader.prototype.load = function(fontFamilies) {
		this.totalFonts += fontFamilies.length;

		var that = this;
		WebFont.load({ 
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

	splat.FontLoader = FontLoader;
	return splat;

}(Splat || {}, window));
