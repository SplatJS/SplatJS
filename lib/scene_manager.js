"use strict";

/**
 * Provides a way to switch between {@link Scene}s. This is usually set up for you in {@link Game}.
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
 * Begin tracking a {@link Scene}.
 * @param {string} name The name of the {@link Scene} to be used later when you call {@link SceneManager#switchTo}.
 * @param {Scene} scene The Scene to track.
 */
SceneManager.prototype.add = function(name, scene) {
	this.scenes[name] = scene;
};
/**
 * Fetch a {@link Scene} that was previously stored with {@link SceneManager#add}.
 * @param {string} name The name that was provided when the {@link Scene} was stored during {@link SceneManager#add}.
 * @returns {Scene}
 */
SceneManager.prototype.get = function(name) {
	return this.scenes[name];
};
/**
 * Stop running the current {@link Scene}, and start running the named Scene.
 * @param {string} name The name that was providded when the {@link Scene} was stored during {@link SceneManager#add}.
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
	this.currentScene.start();
};

module.exports = SceneManager;
