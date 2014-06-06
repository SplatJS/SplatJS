var fs = require("fs");
var browserify = require("browserify");

var license = fs.readFileSync("LICENSE.TXT");
var version = process.env["npm_package_version"];
var header = "/*\n\nSplat " + version + "\n" + license + "\n*/\n";
var main = "./" + process.env["npm_package_main"];

if (!fs.existsSync("docs")) {
	fs.mkdirSync("docs");
}
if (!fs.existsSync("docs/download")) {
	fs.mkdirSync("docs/download");
}

var out = fs.createWriteStream("docs/download/splat-" + version + ".js");
out.write(header, function(err) {
	var b = browserify();
	b.add(main);
	b.bundle({ standalone: "Splat" }).pipe(out);
});

var minout = fs.createWriteStream("docs/download/splat-" + version + ".min.js");
minout.write(header, function(err) {
	var b = browserify();
	b.add(main);
	b.transform({ global: true }, "uglifyify");
	b.bundle({ standalone: "Splat" }).pipe(minout);
});
