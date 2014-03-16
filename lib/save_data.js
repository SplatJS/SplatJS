"use strict";

function cookieGet(name) {
	var value = "; " + document.cookie;
	var parts = value.split("; " + name + "=");
	if (parts.length === 2) {
		return parts.pop().split(";").shift();
	}
}

function cookieSet(name, value) {
	var expire = new Date();
	expire.setTime(expire.getTime() + 1000 * 60 * 60 * 24 * 365);
	var cookie = name + "=" + value + "; expires=" + expire.toUTCString() + ";";
	document.cookie = cookie;
}

var cookieSaveData = {
	"get": cookieGet,
	"set": cookieSet
};

function localStorageGet(name) {
	return window.localStorage.getItem(name);
}

function localStorageSet(name, value) {
	return window.localStorage.setItem(name, value.toString());
}

var localStorageSaveData = {
	"get": localStorageGet,
	"set": localStorageSet
};

if (window.localStorage) {
	console.log("using local storage");
	module.exports = localStorageSaveData;
} else {
	module.exports = cookieSaveData;
}
