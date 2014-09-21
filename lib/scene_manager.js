"use strict";

/**
 * Provides a way to switch between {@link Splat.Scene}s. An instance of SceneManager is available as {@link Splat.Game#scenes}.
 * @constructor
 */
function SceneManager() {
	/**
	 * A key-value list of all the named scenes.
	 * @member {object}
	 * @private
	 */
	this.scenes = {};
}
/**
 * Begin tracking a {@link Splat.Scene}.
 * @param {string} name The name of the {@link Splat.Scene} to be used later when you call {@link SceneManager#switchTo}.
 * @param {Splat.Scene} scene The Scene to track.
 */
SceneManager.prototype.add = function(name, scene) {
	this.scenes[name] = scene;
};
/**
 * Fetch a {@link Splat.Scene} that was previously stored with {@link SceneManager#add}.
 * @param {string} name The name that was provided when the {@link Splat.Scene} was stored during {@link SceneManager#add}.
 * @returns {Splat.Scene}
 */
SceneManager.prototype.get = function(name) {
	return this.scenes[name];
};
/**
 * Stop running the current {@link Splat.Scene}, and start running the named Scene.
 * @param {string} name The name that was providded when the {@link Splat.Scene} was stored during {@link SceneManager#add}.
 */
SceneManager.prototype.switchTo = function(name) {
	if (this.currentScene === this.scenes[name]) {
		this.currentScene.reset();
		return;
	}
	if (this.currentScene !== undefined) {
		this.currentScene.stop();
	}
	this.currentScene = this.scenes[name];
	this.currentScene.reset();
	this.currentScene.start();
};

module.exports = SceneManager;
