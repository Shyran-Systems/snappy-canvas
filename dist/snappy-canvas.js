(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.SnappyCanvas = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

module.exports = require("./snappy-canvas.js");

},{"./snappy-canvas.js":2}],2:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SnappyContext2D = require("./snappy-context2d.js");

var SnappyCanvas = function SnappyCanvas(options) {
    _classCallCheck(this, SnappyCanvas);

    var canvas = options.canvas || document.createElement("canvas");
    SnappyCanvas.transformCanvas(canvas, options);
    if (options.width !== undefined) {
        canvas.width = options.width;
    }
    if (options.height !== undefined) {
        canvas.height = options.height;
    }
    return canvas;
};

SnappyCanvas.transformCanvas = function (canvas) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var _scale = options.scale !== undefined ? options.scale : 1;
    var _translationX = options.translationX !== undefined ? options.translationX : 0;
    var _translationY = options.translationY !== undefined ? options.translationY : 0;
    var _scaleLineWidth = options.scaleLineWidth !== undefined ? options.scaleLineWidth : true;
    var _resizeCanvas = options.resizeCanvas !== undefined ? options.resizeCanvas : false;

    if (options.uWidth) {
        canvas.width = options.uWidth * _scale | 0;
    }

    if (options.uHeight) {
        canvas.height = options.uHeight * _scale | 0;
    }

    canvas._rawContext2d = canvas.getContext("2d");
    canvas._snappyContext2d = new SnappyContext2D(canvas._rawContext2d);

    canvas.getContext = function (contextType) {
        if (contextType != "2d") {
            throw new Error("ValueError: SnappyCanvas only supports '2d' context type.");
        }
        return this._snappyContext2d;
    };

    canvas.translate = function (tx, ty) {
        _translationX = tx;
        _translationY = ty;
        this.render();
    };

    canvas.render = function () {
        this._snappyContext2d.render();
    };

    Object.defineProperty(canvas, "scale", {
        enumerable: true,
        configurable: false,
        get: function get() {
            return _scale;
        },
        set: function set(scale) {
            var uWidth = this.uWidth;
            var uHeight = this.uHeight;
            _scale = scale;
            this.width = uWidth * _scale | 0;
            this.height = uHeight * _scale | 0;
            this.render();
        }
    });

    Object.defineProperty(canvas, "translationX", {
        enumerable: true,
        configurable: false,
        get: function get() {
            return _translationX;
        },
        set: function set(tx) {
            _translationX = tx;
            this.render();
        }
    });

    Object.defineProperty(canvas, "translationY", {
        enumerable: true,
        configurable: false,
        get: function get() {
            return _translationY;
        },
        set: function set(ty) {
            _translationY = ty;
            this.render();
        }
    });

    Object.defineProperty(canvas, "scaleLineWidth", {
        enumerable: true,
        configurable: false,
        get: function get() {
            return _scaleLineWidth;
        },
        set: function set(scaleLineWidth) {
            _scaleLineWidth = scaleLineWidth;
            this.render();
        }
    });

    Object.defineProperty(canvas, "resizeCanvas", {
        enumerable: true,
        configurable: false,
        get: function get() {
            return _resizeCanvas;
        },
        set: function set(resizeCanvas) {
            _resizeCanvas = resizeCanvas;
            this.render();
        }
    });

    Object.defineProperty(canvas, "uWidth", {
        enumerable: true,
        configurable: false,
        get: function get() {
            return this.width / _scale | 0;
        },
        set: function set(uWidth) {
            this.width = uWidth * _scale | 0;
            this.render();
        }
    });

    Object.defineProperty(canvas, "uHeight", {
        enumerable: true,
        configurable: false,
        get: function get() {
            return this.height / _scale | 0;
        },
        set: function set(uHeight) {
            this.height = uHeight * _scale | 0;
            this.render();
        }
    });
};

module.exports = SnappyCanvas;

},{"./snappy-context2d.js":3}],3:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var helpers = "./helpers.js";

var SnappyContext2D = function () {
    function SnappyContext2D(context2d) {
        _classCallCheck(this, SnappyContext2D);

        Object.defineProperty(this, "_context2d", {
            enumerable: false,
            configurable: false,
            value: context2d
        });
    }

    _createClass(SnappyContext2D, [{
        key: "render",
        value: function render() {
            var _options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            var ctx = this._context2d;

            var options = {
                translationX: 0,
                translationY: 0,
                scale: 1,
                scaleLineWidth: true
            };

            if (ctx.canvas._snappyContext2d === this) {
                options.translationX = ctx.canvas.translationX;
                options.translationY = ctx.canvas.translationY;
                options.scale = ctx.canvas.scale;
                options.scaleLineWidth = ctx.canvas.scaleLineWidth;
            }

            helpers.merge(options, _options);

            var canvasStatus = {
                translationX: options.translationX,
                translationY: options.translationY,
                scale: options.scale,
                lineWidth: 1
            };

            var canvasStatusStack = [];
            var isStroke = 0;

            // TODO
        }
    }]);

    return SnappyContext2D;
}();

module.exports = SnappyContext2D;

},{}]},{},[1])(1)
});