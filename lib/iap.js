"use strict";

var platform = require("./platform");

if (platform.isEjecta()) {
	var iap = new window.Ejecta.IAPManager();

	module.exports = {
		"get": function(sku, callback) {
			iap.getProducts([sku], function(err, products) {
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
			iap.restoreTransactions(function(err, transactions) {
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
	module.exports = {
		"get": function(sku, callback) {
			window.google.payments.inapp.getSkuDetails({
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
			window.google.payments.inapp.buy({
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
			window.google.payments.inapp.getPurchases({
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
	module.exports = {
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
