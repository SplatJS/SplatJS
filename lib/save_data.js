"use strict";
/**
 * @namespace Splat.saveData
 */

var platform = require("./platform");

function cookieGet(name) {
	var value = "; " + document.cookie;
	var parts = value.split("; " + name + "=");
	if (parts.length === 2) {
		return parts.pop().split(";").shift();
	} else {
		throw "cookie " + name + " was not found";
	}
}

function cookieSet(name, value) {
	var expire = new Date();
	expire.setTime(expire.getTime() + 1000 * 60 * 60 * 24 * 365);
	var cookie = name + "=" + value + "; expires=" + expire.toUTCString() + ";";
	document.cookie = cookie;
}

function getMultiple(getSingleFunc, keys, callback) {
	if (typeof keys === "string") {
		keys = [keys];
	}

	try
	{
		var data = keys.map(function(key) {
			return [key, getSingleFunc(key)];
		}).reduce(function(accum, pair) {
			accum[pair[0]] = pair[1];
			return accum;
		}, {});

		callback(undefined, data);
	}
	catch (e) {
		callback(e);
	}
}

function setMultiple(setSingleFunc, data, callback) {
	try {
		for (var key in data) {
			if (data.hasOwnProperty(key)) {
				setSingleFunc(key, data[key]);
			}
		}
		callback();
	}
	catch (e) {
		callback(e);
	}
}

var cookieSaveData = {
	"get": getMultiple.bind(undefined, cookieGet),
	"set": setMultiple.bind(undefined, cookieSet)
};

function localStorageGet(name) {
	return window.localStorage.getItem(name);
}

function localStorageSet(name, value) {
	window.localStorage.setItem(name, value.toString());
}

var localStorageSaveData = {
	"get": getMultiple.bind(undefined, localStorageGet),
	"set": setMultiple.bind(undefined, localStorageSet)
};

/**
 * A function that is called when save data has finished being retrieved.
 * @callback saveDataGetFinished
 * @param {error} err If defined, err is the error that occurred when retrieving the data.
 * @param {object} data The key-value pairs of data that were previously saved.
 */
/**
 * Retrieve data previously stored with {@link Splat.saveData.set}.
 * @alias Splat.saveData.get
 * @param {string | Array} keys A single key or array of key names of data items to retrieve.
 * @param {saveDataGetFinished} callback A callback that is called with the data when it has been retrieved.
 */
function chromeStorageGet(keys, callback) {
	window.chrome.storage.sync.get(keys, function(data) {
		if (window.chrome.runtime.lastError) {
			callback(window.chrome.runtime.lastError);
		} else {
			callback(undefined, data);
		}
	});
}

/**
 * A function that is called when save data has finished being stored.
 * @callback saveDataSetFinished
 * @param {error} err If defined, err is the error that occurred when saving the data.
 */
/**
 * Store data for later.
 * @alias Splat.saveData.set
 * @param {object} data An object containing key-value pairs of data to save.
 * @param {saveDataSetFinished} callback A callback that is called when the data has finished saving.
 */
function chromeStorageSet(data, callback) {
	window.chrome.storage.sync.set(data, function() {
		callback(window.chrome.runtime.lastError);
	});
}

var chromeStorageSaveData = {
	"get": chromeStorageGet,
	"set": chromeStorageSet,
};

if (platform.isChromeApp()) {
	module.exports = chromeStorageSaveData;
} else if (window.localStorage) {
	module.exports = localStorageSaveData;
} else {
	module.exports = cookieSaveData;
}
