"use strict";

/**
 * @namespace Splat
 */
 
import buffer = require("./buffer");

export var makeBuffer = buffer.makeBuffer;
export var flipBufferHorizontally = buffer.flipBufferHorizontally;
export var flipBufferVertically = buffer.flipBufferVertically;

export import ads = require("./ads");
export import AnimatedEntity = require("./animated_entity");
export import AStar = require("./astar");
export import BinaryHeap = require("./binary_heap");
export import Button = require("./button");
export import Camera = require("./camera");
export import Entity = require("./entity");
export import EntityBoxCamera = require("./entity_box_camera");
export import Game = require("./game");
export import iap = require("./iap");
export import leaderboards = require("./leaderboards");
export import math = require("./math");
export import openUrl = require("./openUrl");
export import NinePatch = require("./ninepatch");
export import Particles = require("./particles");
export import saveData = require("./save_data");
export import Scene = require("./scene");
export import Timer = require("./timer");
