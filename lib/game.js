"use strict";

var Input = require("./input");
var Scene = require("./scene");
var systems = require("./systems");

function Game(canvas, animations, entities, images, input, require, scenes, sounds, systems) {
	this.animations = animations;
	this.canvas = canvas;
	this.context = canvas.getContext("2d");
	this.entities = entities;
	this.images = images;
	this.input = new Input(input, canvas);
	this.require = require;
	this.scenes = {};
	this.sounds = sounds;
	this.systems = systems;

	this.makeScenes(scenes);
}
Game.prototype.makeScenes = function(sceneList) {
	Object.keys(sceneList).forEach(function(scene) {
		var s = this.makeScene(scene, sceneList[scene]);
		this.scenes[scene] = s;
		if (sceneList[scene].first) {
			this.scene = s;
		}
	}.bind(this));
};
Game.prototype.makeScene = function(name, sceneData) {
	var scene = new Scene();
	scene.entities.load(this.entities[name]);

	var data = this.makeSceneData(scene.entities);
	this.installSystems(this.systems.simulation, scene.simulation, data);
	this.installSystems(this.systems.renderer, scene.renderer, data);

	if (typeof sceneData.onEnter === "string") {
		var enterScript = this.loadScript(sceneData.onEnter);
		if (typeof enterScript === "function") {
			enterScript = enterScript.bind(scene, data);
		}
		scene.onEnter = enterScript;
	}
	if (typeof sceneData.onExit === "string") {
		var exitScript = this.loadScript(sceneData.onExit);
		if (typeof exitScript === "function") {
			exitScript = exitScript.bind(scene, data);
		}
		scene.onExit = exitScript;
	}

	return scene;
};
Game.prototype.makeSceneData = function(entities) {
	return {
		animations: this.animations,
		canvas: this.canvas,
		context: this.context,
		entities: entities,
		images: this.images,
		input: this.input,
		require: this.loadScript.bind(this),
		sounds: this.sounds,
		switchScene: this.switchScene.bind(this)
	};
};
Game.prototype.installSystems = function(systems, ecs, data) {
	systems.forEach(function(system) {
		var script = this.loadScript(system);
		if (script === undefined) {
			console.error("failed to load script", system);
		}
		script(ecs, data);
	}.bind(this));
};
Game.prototype.loadScript = function(script) {
	if (script.indexOf("splatjs:") === 0) {
		var names = script.substr(8).split(".");

		return names.reduce(function(obj, name) {
			return obj[name];
		}, systems);
	} else {
		return this.require(script);
	}
};
Game.prototype.switchScene = function(name) {
	if (this.scene !== undefined) {
		this.scene.stop();
	}
	this.scene = this.scenes[name];
	this.scene.start(this.context);
};

module.exports = Game;
