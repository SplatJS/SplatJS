"use strict";

export function isChromeApp(): boolean {
	return (<any>window).chrome && (<any>window).chrome.app && (<any>window).chrome.app.runtime;
}

export function isEjecta(): boolean {
	return (<any>window).ejecta;
}
