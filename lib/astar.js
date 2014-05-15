"use strict";

var BinaryHeap = require("./binary_heap");

/**
 * Implements the [A* pathfinding algorithm]{@link http://en.wikipedia.org/wiki/A*_search_algorithm} on a 2-dimensional grid. You can use this to find a path between a source and destination coordinate while avoiding obstacles.
 * @constructor
 * @param {isWalkable} isWalkable A function to test if a coordinate is walkable by the entity you're performing the pathfinding for.
 */
function AStar(isWalkable) {
	this.destX = 0;
	this.destY = 0;
	this.scaleX = 1;
	this.scaleY = 1;
	this.openNodes = {};
	this.closedNodes = {};
	this.openHeap = new BinaryHeap(function(a, b) {
		return a.f - b.f;
	});
	this.isWalkable = isWalkable;
}
/**
 * The [A* heuristic]{@link http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html}, commonly referred to as h(x), that estimates how far a location is from the destination. This implementation is the [Manhattan method]{@link http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html#manhattan-distance}, which is good for situations when the entity can travel in four directions. Feel free to replace this with a different heuristic implementation.
 * @param {number} x The x coordinate to estimate the distance to the destination.
 * @param {number} y The y coordinate to estimate the distance to the destination.
 */
AStar.prototype.heuristic = function(x, y) {
	// manhattan method
	var dx = Math.abs(x - this.destX) / this.scaleX;
	var dy = Math.abs(y - this.destY) / this.scaleY;
	return dx + dy;
};
/**
 * Make a node to track a given coordinate
 * @param {number} x The x coordinate of the node
 * @param {number} y The y coordinate of the node
 * @param {object} parent The parent node for the current node. This chain of parents eventually points back at the starting node.
 * @param {number} g The g(x) travel cost from the parent node to this node.
 * @private
 */
AStar.prototype.makeNode = function(x, y, parent, g) {
	g += parent.g;
	var h = this.heuristic(x, y);

	return {
		x: x,
		y: y,
		parent: parent,
		f: g + h,
		g: parent.g + g,
		h: h
	};
};
/**
 * Update the g(x) travel cost to a node if a new lower-cost path is found.
 * @param {string} key The key of the node on the open list.
 * @param {object} parent A parent node that may have a shorter path for the node specified in key.
 * @param {number} g The g(x) travel cost from parent to the node specified in key.
 * @private
 */
AStar.prototype.updateOpenNode = function(key, parent, g) {
	var node = this.openNodes[key];
	if (!node) {
		return false;
	}

	var newG = parent.g + g;

	if (newG >= node.g) {
		return true;
	}

	node.parent = parent;
	node.g = newG;
	node.f = node.g + node.h;

	var pos = this.openHeap.indexOf(node);
	this.openHeap.bubbleUp(pos);

	return true;
};
/**
 * Create a neighbor node to a parent node, and add it to the open list for consideration.
 * @param {string} key The key of the new neighbor node.
 * @param {number} x The x coordinate of the new neighbor node.
 * @param {number} y The y coordinate of the new neighbor node.
 * @param {object} parent The parent node of the new neighbor node.
 * @param {number} g The travel cost from the parent to the new parent node.
 * @private
 */
AStar.prototype.insertNeighbor = function(key, x, y, parent, g) {
	var node = this.makeNode(x, y, parent, g);
	this.openNodes[key] = node;
	this.openHeap.insert(node);
};
AStar.prototype.tryNeighbor = function(x, y, parent, g) {
	var key = makeKey(x, y);
	if (this.closedNodes[key]) {
		return;
	}
	if (!this.isWalkable(x, y)) {
		return;
	}
	if (!this.updateOpenNode(key, parent, g)) {
		this.insertNeighbor(key, x, y, parent, g);
	}
};
AStar.prototype.getNeighbors = function getNeighbors(parent) {
	var diagonalCost = 1.4;
	var straightCost = 1;
	this.tryNeighbor(parent.x - this.scaleX, parent.y - this.scaleY, parent, diagonalCost);
	this.tryNeighbor(parent.x, parent.y - this.scaleY, parent, straightCost);
	this.tryNeighbor(parent.x + this.scaleX, parent.y - this.scaleY, parent, diagonalCost);

	this.tryNeighbor(parent.x - this.scaleX, parent.y, parent, straightCost);
	this.tryNeighbor(parent.x + this.scaleX, parent.y, parent, straightCost);

	this.tryNeighbor(parent.x - this.scaleX, parent.y + this.scaleY, parent, diagonalCost);
	this.tryNeighbor(parent.x, parent.y + this.scaleY, parent, straightCost);
	this.tryNeighbor(parent.x + this.scaleX, parent.y + this.scaleY, parent, diagonalCost);
};

function generatePath(node) {
	var path = [];
	while (node.parent) {
		var ix = node.x;
		var iy = node.y;
		while (ix !== node.parent.x || iy !== node.parent.y) {
			path.unshift({x: ix, y: iy});

			var dx = node.parent.x - ix;
			if (dx > 0) {
				ix++;
			} else if (dx < 0) {
				ix--;
			}
			var dy = node.parent.y - iy;
			if (dy > 0) {
				iy++;
			} else if (dy < 0) {
				iy--;
			}
		}
		node = node.parent;
	}
	return path;
}

function makeKey(x, y) {
	return x + "," + y;
}

/**
 * Search for an optimal path between srcX, srcY and destX, destY, while avoiding obstacles.
 * @param {number} srcX The starting x coordinate
 * @param {number} srcY The starting y coordinate
 * @param {number} destX The destination x coordinate
 * @param {number} destY The destination y coordinate
 * @returns {Array} The optimal path, in the form of an array of objects that each have an x and y property.
 */
AStar.prototype.search = function aStar(srcX, srcY, destX, destY) {
	function scale(c, s) {
		var downscaled = (c / s) |0;
		return downscaled * s;
	}
	srcX = scale(srcX, this.scaleX);
	srcY = scale(srcY, this.scaleY);
	this.destX = scale(destX, this.scaleX);
	this.destY = scale(destY, this.scaleY);

	if (!this.isWalkable(this.destX, this.destY)) {
		return [];
	}

	var srcKey = makeKey(srcX, srcY);
	var srcNode = {
		x: srcX,
		y: srcY,
		g: 0,
		h: this.heuristic(srcX, srcY)
	};
	srcNode.f = srcNode.h;
	this.openNodes = {};
	this.openNodes[srcKey]  = srcNode;
	this.openHeap = new BinaryHeap(function(a, b) {
		return a.f - b.f;
	});
	this.openHeap.insert(srcNode);
	this.closedNodes = {};

	var node = this.openHeap.deleteRoot();
	while (node) {
		var key = makeKey(node.x, node.y);
		delete this.openNodes[key];
		this.closedNodes[key] = node;
		if (node.x === this.destX && node.y === this.destY) {
			return generatePath(node);
		}
		this.getNeighbors(node);
		node = this.openHeap.deleteRoot();
	}
	return [];
};

module.exports = AStar;
