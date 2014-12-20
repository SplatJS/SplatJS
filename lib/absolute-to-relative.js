"use strict";

// converts a changing absolute value into a value relative to the previous value
module.exports = function() {
	var last = -1;
	return function(current) {
		if (last === -1) {
			last = current;
		}
		var delta = current - last;
		last = current;
		return delta;
	};
};
