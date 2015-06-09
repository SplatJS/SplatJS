"use strict";

import Camera = require("./camera");
import Timer = require('./timer');

class Scene {
	/**
	 * The canvas to render on.
	 * @member {external:canvas}
	 * @private
	 */
	private canvas: HTMLCanvasElement;
	/**
	 * A callback to be called ever time the Scene is {@link Splat.Scene#start started}.
	 * @member {emptyCallback}
	 * @private
	 */
	private initFunc: () => void;
	/**
	 * A callback that updates the state of the game's simulation.
	 * @member {simulationCallback}
	 * @private
	 */
	private simulationFunc: (elapsedMillis: number) => void;
	/**
	 * A callback that draws the game.
	 * @member {drawCallback}
	 * @private
	 */
	private drawFunc: (ctx: CanvasRenderingContext2D) => void;
	/**
	 * The drawing context for {@link Scene#canvas}
	 * @member {external:CanvasRenderingContext2D}
	 * @private
	 */
	private context: CanvasRenderingContext2D;
	/**
	 * The Camera used to offset the Scene's drawing.
	 * This Camera's {@link Splat.Entity#move move} and {@link Splat.Camera#draw draw} methods are called automatically for you. The default Camera starts at the origin (0,0).
	 * @member {Splat.Camera}
	 */
	camera: Camera;
	visibilitychange: (visibilityState: string) => void; // TODO: Document; Mentioned in game.ts
	/**
	 * The timestamp of the last frame. Used to determine how many milliseconds elapsed between frames.
	 * @member {number}
	 * @private
	 */
	private lastTimestamp = -1;
	/**
	 * How frequently to run the simulation in Hertz (cycles per second). This should be higher than your expected framerate.
	 * @member {number}
	 * @private
	 */
	private simulationFrequencyHz = 180;
	/**
	 * An accumulator of the leftover time between frames. This lets us run the simulation at a constant framerate independant of the drawing framerate.
	 * @member {number}
	 * @private
	 */
	private timeAccumulator = 0;
	/**
	 * Whether or not the Scene is currently running.
	 * @member {boolean}
	 * @private
	 */
	private running = false;
	/**
	 * A key-value store of named timers. Timers in this object will be automatically {@link Splat.Timer#tick tick()}ed for you when the scene is running..
	 * @member {object}
	 */
	timers: { [name: string]: Timer } = {};
	/**
	 * A flag that enables/disables a frame rate counter in the corner of the screen. This is useful during development.
	 * @member {boolean}
	 */
	showFrameRate = false;
		
	/**
	 * A Scene handles the render loop for the game. Inside of initFunc, simulationFunc, and drawFunc `this` refers to the current scene.
	 * @constructor
	 * @alias Splat.Scene
	 * @param {external:canvas} canvas The canvas to render on.
	 * @param {emptyCallback} initFunc A callback to be called every time the Scene is {@link Splat.Scene#start started}.
	 * @param {simulationCallback} simulationFunc A callback that updates the state of the game's simulation.
	 * @param {drawCallback} drawFunc A callback that draws the game.
	 */
	constructor(canvas: HTMLCanvasElement, initFunc: () => void, simulationFunc: (elapsedMillis: number) => void, drawFunc: (ctx: CanvasRenderingContext2D) => void) {
		this.canvas = canvas;
		this.initFunc = initFunc;
		this.simulationFunc = simulationFunc;
		this.drawFunc = drawFunc;
	
		this.context = (<CanvasRenderingContext2D>canvas.getContext("2d"));
		this.camera = new Camera(0, 0, canvas.width, canvas.height);
	}
	
	/**
	 * Start running the scene.
	 */
	start() {
		this.lastTimestamp = -1;
		this.running = true;
		var scene = this;
		window.requestAnimationFrame(t => this.mainLoop(t));
	}
	
	/**
	 * Stop running the scene.
	 */
	stop() {
		this.running = false;
	}
	
	/**
	 * Reset the simulation by re-running the {@link Splat.Scene#initFunc}.
	 */
	reset() {
		this.initFunc.call(this);
	}
		
	private mainLoop(timestamp: number) {
		if (!this.running) {
			return;
		}
		if (this.lastTimestamp === -1) {
			this.lastTimestamp = timestamp;
		}
		var elapsedMillis = timestamp - this.lastTimestamp;
		this.lastTimestamp = timestamp;
	
		this.timeAccumulator += elapsedMillis;
		var simulationMs = Math.floor(1000 / this.simulationFrequencyHz);
		while (this.timeAccumulator > simulationMs) {
			this.timeAccumulator -= simulationMs;
	
			this.incrementTimers(simulationMs);
			if (!this.running) {
				return;
			}
			this.simulationFunc.call(this, simulationMs);
			this.camera.move(simulationMs);
		}
	
		this.context.save();
		this.camera.draw(this.context);
		this.drawFunc.call(this, this.context);
	
		if (this.showFrameRate) {
			this.drawFrameRate(elapsedMillis);
		}
	
		this.context.restore();
	
		if (this.running) {
			window.requestAnimationFrame(t => this.mainLoop(t));
		}
	}
	
	private incrementTimers(elapsedMillis: number) {
		for (var i in this.timers) {
			if (this.timers.hasOwnProperty(i)) {
				this.timers[i].tick(elapsedMillis);
			}
		}
	}
	
	private drawFrameRate(elapsedMillis: number) {
		var fps = (1000 / elapsedMillis) |0;
	
		this.context.font = "24px mono";
		if (fps < 30) {
			this.context.fillStyle = "#ff0000";
		} else if (fps < 50) {
			this.context.fillStyle = "#ffff00";
		} else {
			this.context.fillStyle = "#00ff00";
		}
		var msg = fps + " FPS";
		var w = this.context.measureText(msg).width;
		this.camera.drawAbsolute(this.context, (ctx) => {
			ctx.fillText(msg, this.canvas.width - w - 50, 50);
		});
	}
}

export = Scene;
