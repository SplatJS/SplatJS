var code = document.getElementById("code");
var run = document.getElementById("run");

run.addEventListener("click", function() {
	console.log("click");
	eval(code.value);
});
