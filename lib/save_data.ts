"use strict";
/**
 * @namespace Splat.saveData
 */

import platform = require("./platform");

interface SaveData {
	get(keys: string | string[], callback: (a: any, b?: any) => void): void;
	set(data: any, callback: (a: any, b?: any) => void): void;
}

var saveData: SaveData;

function cookieGet(name: string) {
	var value = "; " + document.cookie;
	var parts = value.split("; " + name + "=");
	if (parts.length === 2) {
		return parts.pop().split(";").shift();
	} else {
		throw "cookie " + name + " was not found";
	}
}

function cookieSet(name: string, value: any) {
	var expire = new Date();
	expire.setTime(expire.getTime() + 1000 * 60 * 60 * 24 * 365);
	var cookie = name + "=" + value + "; expires=" + expire.toUTCString() + ";";
	document.cookie = cookie;
}

function getMultiple(getSingleFunc: (key: string) => any, keys: string | string[], callback: (a: any, b?: any) => void) {
	if (typeof keys === "string") {
		keys = [(<string>keys)];
	}

	try
	{
		var data = (<string[]>keys).map(key => [key, getSingleFunc(key)])
		.reduce((accum: any, pair: any[]) => {
			accum[pair[0]] = pair[1];
			return accum;
		}, {});

		callback(undefined, data);
	}
	catch (e) {
		callback(e);
	}
}

function setMultiple(setSingleFunc: (key: string, value: any) => void, data: { [key: string]: any }, callback: (a: any, b?: any) => void) {
	try {
		for (var key in data) {
			if (data.hasOwnProperty(key)) {
				setSingleFunc(key, data[key]);
			}
		}
		callback(undefined);
	}
	catch (e) {
		callback(e);
	}
}

var cookieSaveData = {
	"get": getMultiple.bind(undefined, cookieGet),
	"set": setMultiple.bind(undefined, cookieSet)
};

function localStorageGet(name: string) {
	return window.localStorage.getItem(name);
}

function localStorageSet(name: string, value: any) {
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
function chromeStorageGet(keys: string | string[], callback: (a: any, b?: any) => void) {
	(<any>window).chrome.storage.sync.get(keys, function(data: any) {
		if ((<any>window).chrome.runtime.lastError) {
			callback((<any>window).chrome.runtime.lastError);
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
function chromeStorageSet(data: any, callback: (a: any, b?: any) => void) {
	(<any>window).chrome.storage.sync.set(data, function() {
		callback((<any>window).chrome.runtime.lastError);
	});
}

var chromeStorageSaveData = {
	"get": chromeStorageGet,
	"set": chromeStorageSet,
};

if (platform.isChromeApp()) {
	saveData = chromeStorageSaveData;
} else if (window.localStorage) {
	saveData = localStorageSaveData;
} else {
	saveData = cookieSaveData;
}

export = saveData;