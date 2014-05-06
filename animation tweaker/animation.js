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
	var a = animationTweaker.animations.get("animation" + loadCount);
	var x = (canvas.width / 2) - (a.width / 2) |0;
	var y = (canvas.height / 2) - (a.height / 2) |0;
	animation = new Splat.AnimatedEntity(x, y, a.width, a.height, a, 0, 0);

	controls = findControls();
	bindControls(animation);

	controls.width.value = animation.width;
	controls.height.value = animation.height;
	controls.offsetX.value = animation.spriteOffsetX;
	controls.offsetY.value = animation.spriteOffsetY;
	controls.running.checked = running;
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

function loadFileIntoBuffer(file, callback) {
	var fr = new FileReader();
	fr.addEventListener("loadend", function() {
		var img = new Image();
		img.addEventListener("load", function() {
			var buffer = Splat.makeBuffer(img.width, img.height, function(context) {
				context.drawImage(img, 0, 0);
			});
			callback(buffer);
		});
		img.src = fr.result;
	});
	fr.readAsDataURL(file);
}

function getFrames(filename) {
	var matches = filename.match(/f(\d+)/);
	if (matches && matches.length > 1) {
		return parseInt(matches[1]);
	}
	return 1;
}

var controls;
window.addEventListener("load", function() {
	controls = findControls();

	controls.file.addEventListener("change", function() {
		var file = controls.file.files[0];
		loadFileIntoBuffer(file, function(buffer) {
			animationTweaker.scenes.scenes["title"].stop();
			loadCount++;

			var name = "animation" + loadCount;
			// FIXME: this is violating imageloader's privacy. there should be an official way of forcing an image into it
			animationTweaker.images.names.push(name);
			animationTweaker.images.images[name] = buffer;

			var frames = getFrames(file.name);
			controls.frames.innerHTML = frames;
			animationTweaker.animations.load(name, {
				"strip": name,
				"frames": frames,
				"msPerFrame": parseInt(controls.msPerFrame.value),
			});
			animationTweaker.scenes.switchTo("loading");
		});
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
		"file": document.getElementById("file"),
		"frames": document.getElementById("frames"),
		"msPerFrame": document.getElementById("msPerFrame"),
	};
}
