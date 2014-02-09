var canvas = document.getElementById("game");

var manifest = {
	"images": {},
	"sounds": {},
	"fonts": [],
	"animations": {}
};
var animationTweaker = new Splat.Game(canvas, manifest);
var animation;
var loadCount = 0;

animationTweaker.scenes.add("title", new Splat.Scene(canvas, function() {
	console.log("init");
	var a = animationTweaker.animations.get("animation" + loadCount);
	var x = (canvas.width / 2) - (a.width / 2) |0;
	var y = (canvas.height / 2) - (a.height / 2) |0;
	animation = new Splat.AnimatedEntity(x, y, a.width, a.height, a, 0, 0);

	controls = findControls();
	bindControls(animation);
},
function(elapsedMillis) {
	if (!running) {
		return;
	}
	animation.move(elapsedMillis);
	setControls(animation);
}, function(context) {
	context.fillStyle = "#666666";
	context.fillRect(0, 0, canvas.width, canvas.height);

	context.strokeStyle = "#999999";
	context.beginPath();
	context.moveTo(canvas.width/2|0, 0);
	context.lineTo(canvas.width/2|0, canvas.height);
	context.stroke();

	context.beginPath();
	context.moveTo(0, canvas.height/2|0);
	context.lineTo(canvas.width, canvas.height/2|0);
	context.stroke();

	animation.draw(context);

	context.strokeStyle = "rgba(255, 0, 0, 0.5)"
	context.strokeRect(animation.x, animation.y, animation.width, animation.height);
}));

var running = true;

function setControls(entity) {
	controls.width.value = entity.width;
	controls.height.value = entity.height;
	controls.offsetX.value = entity.spriteOffsetX;
	controls.offsetY.value = entity.spriteOffsetY;
	controls.running.checked = running;
	controls.frameCounter.textContent = "Frame " + (animation.sprite.frame + 1) + " of " + animation.sprite.frames.length;
}

function bindControls(entity) {
	controls.width.addEventListener("keyup", function() {
		entity.width = parseInt(controls.width.value);
	});
	controls.height.addEventListener("keyup", function() {
		entity.height = parseInt(controls.height.value);
	});
	controls.offsetX.addEventListener("keyup", function() {
		entity.spriteOffsetX = parseInt(controls.offsetX.value);
	});
	controls.offsetY.addEventListener("keyup", function() {
		entity.spriteOffsetY = parseInt(controls.offsetY.value);
	});
	controls.running.addEventListener("change", function() {
		running = controls.running.checked;
	});
	controls.step.addEventListener("click", function() {
		entity.sprite.step();
		setControls(entity);
	});
	controls.msPerFrame.addEventListener("keyup", function() {
		var animation = entity.sprite;
		var ms = parseInt(controls.msPerFrame.value);
		if (ms < 1) {
			ms = 1;
		}
		
		for (var i = 0; i < animation.frames.length; i++) {
			animation.frames[i].time = ms;
		}
	});
}

var controls;
window.addEventListener("load", function() {
	controls = findControls();

	controls.load.addEventListener("click", function() {
		animationTweaker.scenes.scenes["title"].stop();
		loadCount++;
		animationTweaker.animations.load("animation" + loadCount, {
			"strip": controls.filename.value,
			"frames": parseInt(controls.frames.value),
			"msPerFrame": parseInt(controls.msPerFrame.value),
		});
		animationTweaker.scenes.switchTo("loading");
	});
});

function findControls() {
	return {
		"width": document.getElementById("width"),
		"height": document.getElementById("height"),
		"offsetX": document.getElementById("offsetX"),
		"offsetY": document.getElementById("offsetY"),
		"running": document.getElementById("running"),
		"step": document.getElementById("step"),
		"frameCounter": document.getElementById("frameCounter"),
		"filename": document.getElementById("filename"),
		"load": document.getElementById("load"),
		"frames": document.getElementById("frames"),
		"msPerFrame": document.getElementById("msPerFrame"),
	};
}
