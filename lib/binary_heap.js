"use strict";

function BinaryHeap(cmp) {
	this.cmp = cmp;
	this.array = [];
	this.length = 0;
}
BinaryHeap.prototype.parentIndex = function(i) {
	return ((i - 1) / 2) |0;
};
BinaryHeap.prototype.firstChildIndex = function(i) {
	return (2 * i) + 1;
};
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
BinaryHeap.prototype.insert = function(data) {
	this.array.push(data);
	this.length = this.array.length;
	var pos = this.array.length - 1;
	this.bubbleUp(pos);
};
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
BinaryHeap.prototype.indexOf = function(data) {
	for (var i = 0; i < this.array.length; i++) {
		if (this.array[i] === data) {
			return i;
		}
	}
	return -1;
};

module.exports = BinaryHeap;
