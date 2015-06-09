"use strict";

import Scene = require('./scene');

class SceneManager {
	/**
	 * A key-value list of all the named scenes.
	 * @member {object}
	 * @private
	 */
	scenes: { [name: string]: Scene } = {};
	
	currentScene: Scene;
		
	/**
	 * Provides a way to switch between {@link Splat.Scene}s. An instance of SceneManager is available as {@link Splat.Game#scenes}.
	 * @constructor
	 */
	constructor() {
	}
	
	/**
	 * Begin tracking a {@link Splat.Scene}.
	 * @param {string} name The name of the {@link Splat.Scene} to be used later when you call {@link SceneManager#switchTo}.
	 * @param {Splat.Scene} scene The Scene to track.
	 */
	add(name: string, scene: Scene) {
		this.scenes[name] = scene;
	}
	
	/**
	 * Fetch a {@link Splat.Scene} that was previously stored with {@link SceneManager#add}.
	 * @param {string} name The name that was provided when the {@link Splat.Scene} was stored during {@link SceneManager#add}.
	 * @returns {Splat.Scene}
	 */
	get(name: string) {
		return this.scenes[name];
	}
	
	/**
	 * Stop running the current {@link Splat.Scene}, and start running the named Scene.
	 * @param {string} name The name that was providded when the {@link Splat.Scene} was stored during {@link SceneManager#add}.
	 */
	switchTo(name: string) {
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
	}
}

export = SceneManager;
