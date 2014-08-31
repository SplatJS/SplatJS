"use strict";
/**
 * @namespace Splat.leaderboards
 */

var platform = require("./platform");

if (platform.isEjecta()) {
	var gameCenter = new window.Ejecta.GameCenter();
	gameCenter.softAuthenticate();

	var authFirst = function(action) {
		if (gameCenter.authed) {
			action();
		} else {
			gameCenter.authenticate(function(err) {
				if (err) {
					return;
				}
				action();
			});
		}
	};

	module.exports = {
		/**
		 * Report that an achievement was achieved.
		 * @alias Splat.leaderboards.reportAchievement
		 * @param {string} id The name of the achievement.
		 * @param {int} percent The percentage of the achievement that is completed in the range of 0-100.
		 */
		"reportAchievement": function(id, percent) {
			authFirst(function() {
				gameCenter.reportAchievement(id, percent);
			});
		},
		/**
		 * Report that a score was achieved on a leaderboard.
		 * @alias Splat.leaderboards.reportScore
		 * @param {string} leaderboard The name of the leaderboard the score is on.
		 * @param {int} score The score that was achieved.
		 */
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
	module.exports = {
		"reportAchievement": function() {},
		"reportScore": function() {},
		"showAchievements": function() {},
		"showLeaderboard": function() {}
	};
}

