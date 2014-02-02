var Splat = (function(splat, window, document) {

	function SceneManager() {
		this.scenes = {};
	}
	SceneManager.prototype.add = function(name, scene) {
		this.scenes[name] = scene;
		if (this.currentScene === undefined) {
			this.currentScene = scene;
			this.currentScene.start();
		}
	};
	SceneManager.prototype.switchTo = function(name) {
		if (this.currentScene === this.scenes[name]) {
			this.currentScene.reset();
			return;
		}
		this.currentScene.stop();
		this.currentScene = this.scenes[name];
		this.currentScene.start();
	};

	splat.SceneManager = SceneManager;
	return splat;

}(Splat || {}, window, document));
