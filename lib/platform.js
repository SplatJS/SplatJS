"use strict";

module.exports = {
	isChromeApp: function() {
		return window.chrome && window.chrome.app && window.chrome.app.runtime;
	},
	isEjecta: function() {
		return window.ejecta;
	}
};
