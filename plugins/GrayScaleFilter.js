/*:
 * NOTE: Developed using the following git repository. https://github.com/pixijs/pixi-filters/
 *
 * @plugindesc GrayScale Filter
 * @author weakboar
 *
 * @help This plugin does not provide plugin commands.
 */
/*:ja
 * メモ: 次の git repository を利用して開発しました。 https://github.com/pixijs/pixi-filters/
 *
 * @plugindesc グレースケール化します
 * @author weakboar
 *
 * @help  このプラグインにはプラグインコマンドはありません。
 */

/*!
 * pixi-filters - v1.0.6
 * Compiled Mon, 08 May 2017 19:41:22 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.grayscale = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Make sure PIXI global object is available
if (typeof PIXI === "undefined") {
    throw new Error('pixi.js is required to be included');
}
},{}],2:[function(require,module,exports){


/**
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 */
function GrayScaleFilter()
{
    PIXI.Filter.call(this,
        // vertex shader
        "#define GLSLIFY 1\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",
        // fragment shader
        "precision mediump float;\n#define GLSLIFY 1\n\nuniform sampler2D uSampler;\nvarying vec2      vTextureCoord;\n\nconst float redScale   = 0.298912;\nconst float greenScale = 0.586611;\nconst float blueScale  = 0.114478;\nconst vec3  monochromeScale = vec3(redScale, greenScale, blueScale);\n\nvoid main(void){\n    vec4 smpColor = texture2D(uSampler, vTextureCoord);\n    float grayColor = dot(smpColor.rgb, monochromeScale);\n    smpColor = vec4(vec3(grayColor), 1.0);\n    gl_FragColor = smpColor;\n}"
    );
}

GrayScaleFilter.prototype = Object.create(PIXI.Filter.prototype);
GrayScaleFilter.prototype.constructor = GrayScaleFilter;
module.exports = GrayScaleFilter;

},{}],3:[function(require,module,exports){
require('../check');

var filter = PIXI.filters.GrayScaleFilter = require('./GrayScaleFilter');

// Export for requiring
if (typeof module !== 'undefined' && module.exports) {
    module.exports = filter;
}
},{"../check":1,"./GrayScaleFilter":2}]},{},[3])(3)
});


//# sourceMappingURL=grayscale.js.map
