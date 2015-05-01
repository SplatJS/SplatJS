"use strict";

export function isChromeApp() {
	return (<any>window).chrome && (<any>window).chrome.app && (<any>window).chrome.app.runtime;
}

export function isEjecta() {
	return (<any>window).ejecta;
}
