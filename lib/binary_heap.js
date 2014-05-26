"use strict";

/**
 * An implementation of the [Binary Heap]{@link https://en.wikipedia.org/wiki/Binary_heap} data structure suitable for priority queues.
 * @constructor
 * @alias Splat.BinaryHeap
 * @param {compareFunction} cmp A comparison function that determines how the heap is sorted.
 */
function BinaryHeap(cmp) {
	/**
	 * The comparison function for sorting the heap.
	 * @member {compareFunction}
	 * @private
	 */
	this.cmp = cmp;
	/**
	 * The list of elements in the heap.
	 * @member {Array}
	 * @private
	 */
	this.array = [];
	/**
	 * The number of elements in the heap.
	 * @member {number}
	 * @readonly
	 */
	this.length = 0;
}
/**
 * Calculate the index of a node's parent.
 * @param {number} i The index of the child node
 * @returns {number}
 * @private
 */
BinaryHeap.prototype.parentIndex = function(i) {
	return ((i - 1) / 2) |0;
};
/**
 * Calculate the index of a parent's first child node.
 * @param {number} i The index of the parent node
 * @returns {number}
 * @private
 */
BinaryHeap.prototype.firstChildIndex = function(i) {
	return (2 * i) + 1;
};
/**
 * Bubble a node up the heap, stopping when it's value should not be sorted before its parent's value.
 * @param {number} pos The index of the node to bubble up.
 * @private
 */
BinaryHeap.prototype.bubbleUp = function(pos) {
	if (pos === 0) {
		return;
	}

	var data = this.array[pos];
	var parentIndex = this.parentIndex(pos);
	var parent = this.array[parentIndex];
	if (this.cmp(data, parent) < 0) {
		this.array[parentIndex] = data;
		this.array[pos] = parent;
		this.bubbleUp(parentIndex);
	}
};
/**
 * Store a new node in the heap.
 * @param {object} data The data to store
 */
BinaryHeap.prototype.insert = function(data) {
	this.array.push(data);
	this.length = this.array.length;
	var pos = this.array.length - 1;
	this.bubbleUp(pos);
};
/**
 * Bubble a node down the heap, stopping when it's value should not be sorted after its parent's value.
 * @param {number} pos The index of the node to bubble down.
 * @private
 */
BinaryHeap.prototype.bubbleDown = function(pos) {
	var left = this.firstChildIndex(pos);
	var right = left + 1;
	var largest = pos;
	if (left < this.array.length && this.cmp(this.array[left], this.array[largest]) < 0) {
		largest = left;
	}
	if (right < this.array.length && this.cmp(this.array[right], this.array[largest]) < 0) {
		largest = right;
	}
	if (largest !== pos) {
		var tmp = this.array[pos];
		this.array[pos] = this.array[largest];
		this.array[largest] = tmp;
		this.bubbleDown(largest);
	}
};
/**
 * Remove the heap's root node, and return it. The root node is whatever comes first as determined by the {@link compareFunction}.
 * @returns {data} The root node's data.
 */
BinaryHeap.prototype.deleteRoot = function() {
	var root = this.array[0];
	if (this.array.length <= 1) {
		this.array = [];
		this.length = 0;
		return root;
	}
	this.array[0] = this.array.pop();
	this.length = this.array.length;
	this.bubbleDown(0);
	return root;
};
/**
 * Search for a node in the heap.
 * @param {object} data The data to search for.
 * @returns {number} The index of the data in the heap, or -1 if it is not found.
 */
BinaryHeap.prototype.indexOf = function(data) {
	for (var i = 0; i < this.array.length; i++) {
		if (this.array[i] === data) {
			return i;
		}
	}
	return -1;
};

module.exports = BinaryHeap;
