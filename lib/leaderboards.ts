"use strict";
/**
 * @namespace Splat.leaderboards
 */

import platform = require("./platform");

interface Leaderboard {
	/**
	 * Report that an achievement was achieved.
	 * @alias Splat.leaderboards.reportAchievement
	 * @param {string} id The name of the achievement.
	 * @param {int} percent The percentage of the achievement that is completed in the range of 0-100.
	 */
	reportAchievement(id: string, percent: number): void;
	reportScore(leaderboard: string, score: number): void;
	showAchievements(): void;
	showLeaderboard(name: string): void;
}

var leaderboard: Leaderboard;

if (platform.isEjecta()) {
	var gameCenter = new (<any>window).Ejecta.GameCenter();
	gameCenter.softAuthenticate();

	var authFirst = function(action: () => void) {
		if (gameCenter.authed) {
			action();
		} else {
			gameCenter.authenticate(function(err: any) {
				if (err) {
					return;
				}
				action();
			});
		}
	};

	leaderboard = {
		"reportAchievement": function(id, percent) {
			authFirst(function() {
				gameCenter.reportAchievement(id, percent);
			});
		},
		"reportScore": function(leaderboard, score) {
			authFirst(function() {
				gameCenter.reportScore(leaderboard, score);
			});
		},
		/**
		 * Show the achievements screen.
		 * @alias Splat.leaderboards.showAchievements
		 */
		"showAchievements": function() {
			authFirst(function() {
				gameCenter.showAchievements();
			});
		},
		/**
		 * Show a leaderboard screen.
		 * @alias Splat.leaderboards.showLeaderboard
		 * @param {string} name The name of the leaderboard to show.
		 */
		"showLeaderboard": function(name) {
			authFirst(function() {
				gameCenter.showLeaderboard(name);
			});
		}
	};
} else {
	leaderboard = {
		"reportAchievement": function() {},
		"reportScore": function() {},
		"showAchievements": function() {},
		"showLeaderboard": function() {}
	};
}

export = leaderboard;