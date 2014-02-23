module.exports = {
	"oscillate": function(current, period) {
		return Math.sin(current / period * Math.PI);
	}
};
