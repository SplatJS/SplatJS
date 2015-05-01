"use strict";

import platform = require("./platform");

interface IAP {
	get(sku: string, callback: (a, b?) => void);
	buy(product: any, quantity: number, callback: (a, b?) => void);
	restore(callback: (a, b?) => void);
}

var iap: IAP;

if (platform.isEjecta()) {
	var ejectaiap = new (<any>window).Ejecta.IAPManager();

	iap = {
		"get": function(sku, callback) {
			ejectaiap.getProducts([sku], function(err, products) {
				if (err) {
					callback(err);
					return;
				}
				callback(undefined, products[0]);
			});
		},
		"buy": function(product, quantity, callback) {
			product.purchase(quantity, callback);
		},
		"restore": function(callback) {
			ejectaiap.restoreTransactions(function(err, transactions) {
				if (err) {
					callback(err);
					return;
				}
				callback(undefined, transactions.map(function(transaction) {
					return transaction.productId;
				}));
			});
		}
	};
} else if (platform.isChromeApp()) {
	// FIXME: needs google's buy.js included
	// https://developer.chrome.com/webstore/payments-iap
	iap = {
		"get": function(sku, callback) {
			(<any>window).google.payments.inapp.getSkuDetails({
				"parameters": {
					"env": "prod"
				},
				"sku": sku,
				"success": function(response) {
					callback(undefined, response.response.details.inAppProducts[0]);
				},
				"failure": function(response) {
					callback(response);
				}
			});
		},
		"buy": function(product, quantity, callback) { // jshint ignore:line
			(<any>window).google.payments.inapp.buy({
				"parameters": {
					"env": "prod"
				},
				"sku": product.sku,
				"success": function(response) {
					callback(undefined, response);
				},
				"failure": function(response) {
					callback(response);
				}
			});
		},
		"restore": function(callback) {
			(<any>window).google.payments.inapp.getPurchases({
				"success": function(response) {
					callback(undefined, response.response.details.map(function(detail) {
						return detail.sku;
					}));
				},
				"failure": function(response) {
					callback(response);
				}
			});
		}
	};
} else {
	iap = {
		"get": function(sku, callback) { // jshint ignore:line
			callback(undefined, undefined);
		},
		"buy": function(product, quantity, callback) { // jshint ignore:line
			callback(undefined);
		},
		"restore": function(callback) {
			callback(undefined, []);
		}
	};
}

export = iap;