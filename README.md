# SplatJS

A 2d HTML5 Canvas game engine

SplatJS is a 2d game engine made for creating multi-platform games entirely in JavaScript.

# Features

* Rectangles!
* Keyboard, mouse, and touch input
* Sounds and music (Web Audio API and HTML5 Audio)
* Sprite animation
* Asset loading, and built-in loading screen
* Games work well on phones, tablets, and desktop browsers.
* A\* Pathfinding
* Particles

# Supported Platforms

* Chrome (desktop & mobile)
* Firefox
* Internet Explorer (desktop & mobile)
* Safari (desktop & mobile)
* iOS using [Ejecta](http://impactjs.com/ejecta)
* Chrome Web Store

SplatJS works in PhoneGap/Cordova, but it seems like the apps it produces lack hardware acceleration, making games unplayable.

# Download a standalone SplatJS:

* 3.0.0 [uncompressed](https://splatjs.github.io/download/splat-3.0.0.js) - [minified](https://splatjs.github.io/download/splat-3.0.0.min.js)

# Install through [NPM](https://www.npmjs.org)

```
$ npm install --save splatjs
```
Then require SplatJS into your game:
```
var Splat = require("splat");
```
Then use [browserify](http://browserify.org/) to bundle your game as a single JavaScript file for the browser.

# Games using SplatJS

* [Splat Pong](https://github.com/SplatJS/splatpong) is a good tutorial project to read through.
* [SyRUSH](http://twoscoopgames.com/syrush/)
* [Stanley Squeaks and the Emerald Burrito](http://twoscoopgames.com/stanleysqueaks/)
* [Mr. Fluffykin's Great Sorting Adventure](http://twoscoopgames.com/fluffykins/)
* [Arkeynoid](http://mintchipleaf.com/games/ludum/)
* [Kickbot](http://twoscoopgames.com/kickbot/)
* [base.jump](http://mintchipleaf.com/games/basejump/)
* [Apartment 213](http://twoscoopgames.com/apartment213/)
* [Scurry](http://twoscoopgames.com/scurry/)
* [Echo Bat](http://mintchipleaf.com/games/echobat/)

Send a pull request to add your game to the list!
