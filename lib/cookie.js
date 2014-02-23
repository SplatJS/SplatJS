function get(name) {
	var value = "; " + document.cookie;
	var parts = value.split("; " + name + "=");
	if (parts.length == 2) {
		return parts.pop().split(";").shift();
	}
}

function set(name, value) {
	var expire = new Date();
	expire.setTime(expire.getTime() + 1000 * 60 * 60 * 24 * 365);
	var cookie = name + "=" + value + "; expires=" + expire.toUTCString() + ";";
	document.cookie = cookie;
}

module.exports = {
	"get": get,
	"set": set
};
