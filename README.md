Splat
=====

A 2d HTML5 Canvas game engine

Splat is a 2d game engine made for creating multi-platform games entirely in Javascript.

Features
========

* Retangles!
* Keyboard, mouse, and touch input
* Sounds and music (Web Audio API and HTML5 Audio)
* Sprite animation
* Asset loading, and built-in loading screen
* Games work well on phones, tablets, and desktop browsers.

Supported Platforms
===================

* Chrome (desktop & mobile)
* Firefox
* Internet Explorer (desktop & mobile)
* Safari (desktop & mobile)
* iOS using [Ejecta](http://impactjs.com/ejecta)
* Chrome Web Store

Splat works in PhoneGap/Cordova, but it seems like the apps it produces lack hardware acceleration, making games unplayable.

Installation
============

**This is still a work-in-progress.**

Options:
1. Copy the demo pong repository and modify it. **DOESN'T EXIST YET**
2. Download a prebuilt splat.js file from **SOMEWHERE**.
3. `npm install splat2d` and use [browserify](http://browserify.org/) to `require()` it into your game and produce a single, minified .js file.
4. `git submodule add http://github.com/ericlathrop/splat.git` then `cd splat` then `npm run-script browserify`

Games using Splat
=================

* [Kickbot](http://twoscoopgames.com/kickbotgame/)
* [base.jump](http://mintchipleaf.com/games/basejump/)
* [Apartment 213](http://twoscoopgames.com/apt-213game/)
* [Scurry](http://twoscoopgames.com/scurrygame/)
* [Echo Bat](http://mintchipleaf.com/games/echobat/)

Send a pull request to add your game to the list!
