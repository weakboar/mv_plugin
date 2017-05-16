/*:
 * NOTE: Developed using the following git repository. https://github.com/pixijs/pixi-filters/
 *
 * @plugindesc Bloom Filter
 * @author weakboar
 *
 * @help This plugin does not provide plugin commands.
 */
/*:ja
 * メモ: 次の git repository を利用して開発しました。 https://github.com/pixijs/pixi-filters/
 *
 * @plugindesc 光が漏れるような効果があります。
 * @author weakboar
 *
 * @help  このプラグインにはプラグインコマンドはありません。
 */

/*!
 * pixi-filters - v1.0.6
 * Compiled Mon, 08 May 2017 17:30:40 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.boidbloom = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var BlurXFilter = PIXI.filters.BlurXFilter,
    BlurYFilter = PIXI.filters.BlurYFilter,
    VoidFilter = PIXI.filters.VoidFilter,
    ThresholdFilter = require('./BloomThresholdFilter'),
    IntensityFilter = require('./BloomIntensityFilter');

/**
 * (Google Translate)
 * The BloomFilter applies a Gaussian blur after cut out brightness to an object.
 * The strength of the blur can be set for x- and y-axis separately.
 * The threshold can be set.
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 */
function BloomFilter()
{
    PIXI.Filter.call(this);

    this.blurXFilter = new BlurXFilter();
    this.blurYFilter = new BlurYFilter();
    this.blurXFilter.blur = this.blurYFilter.blur = 8

    this.defaultFilter = new VoidFilter();
    this.cutoutFilter = new ThresholdFilter();
    this.intensityFilter = new IntensityFilter();
    this.intensityFilter.blendMode = PIXI.BLEND_MODES.SCREEN;
}

BloomFilter.prototype = Object.create(PIXI.Filter.prototype);
BloomFilter.prototype.constructor = BloomFilter;
module.exports = BloomFilter;

BloomFilter.prototype.apply = function (filterManager, input, output)
{
    var renderTarget = filterManager.getRenderTarget(true);

    this.defaultFilter.apply(filterManager, input, output);

    this.cutoutFilter.apply(filterManager, input, renderTarget, true);
    this.blurXFilter.apply(filterManager, renderTarget, renderTarget, false);
    this.blurYFilter.apply(filterManager, renderTarget, renderTarget, false);
    this.intensityFilter.apply(filterManager, renderTarget, output, false);

    filterManager.returnRenderTarget(renderTarget);
};

Object.defineProperties(BloomFilter.prototype, {
    /**
     * Sets the strength of both the blurX and blurY properties simultaneously
     *
     * @member {number}
     * @default 8
     */
    blur: {
        get: function ()
        {
            return this.blurXFilter.blur;
        },
        set: function (value)
        {
            this.blurXFilter.blur = this.blurYFilter.blur = value;
        }
    },

    /**
     * Sets the strength of the blurX property
     *
     * @member {number}
     * @default 8
     */
    blurX: {
        get: function ()
        {
            return this.blurXFilter.blur;
        },
        set: function (value)
        {
            this.blurXFilter.blur = value;
        }
    },

    /**
     * Sets the strength of the blurY property
     *
     * @member {number}
     * @default 8
     */
    blurY: {
        get: function ()
        {
            return this.blurYFilter.blur;
        },
        set: function (value)
        {
            this.blurYFilter.blur = value;
        }
    },

    /**
     * Sets the threshold of brightness
     *
     * @member {number}
     * @default 0.85
     */
    threshold: {
        get: function ()
        {
            return this.cutoutFilter.threshold;
        },
        set: function (value)
        {
            this.cutoutFilter.threshold = value;
        }
    },

    /**
     * Sets the bloom intensity
     *
     * @member {number}
     * @default 0.5
     */
    intensity: {
        get: function ()
        {
            return this.intensityFilter.intensity;
        },
        set: function (value)
        {
            this.intensityFilter.intensity = value;
        }
    }
});

},{"./BloomIntensityFilter":2,"./BloomThresholdFilter":3}],2:[function(require,module,exports){


/**
 * (Google Translate)
 * BloomIntensityFilter applies a multi filter.
 * The Intensity can be set.
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 */
function BloomIntensityFilter()
{
    PIXI.Filter.call(this,
        // vertex shader
        "#define GLSLIFY 1\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",
        // fragment shader
        "precision mediump float;\n#define GLSLIFY 1\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float intensity;\n\nvoid main(void)\n{\n   gl_FragColor = texture2D(uSampler, vTextureCoord) * intensity;\n   gl_FragColor.a = 1.0;\n}\n"
    );

    this.intensity = 0.5;
}

BloomIntensityFilter.prototype = Object.create(PIXI.Filter.prototype);
BloomIntensityFilter.prototype.constructor = BloomIntensityFilter;
module.exports = BloomIntensityFilter;

Object.defineProperties(BloomIntensityFilter.prototype, {
    /**
     * set intensity.
     *
     * @member {PIXI.Point}
     * @memberof PIXI.filters.BloomIntensityFilter#
     */
    intensity: {
        get: function ()
        {
            return this.uniforms.intensity;
        },
        set: function (value)
        {
            this.uniforms.intensity = value;
        }
    }
});

},{}],3:[function(require,module,exports){


/**
 * (Google Translate)
 * BloomThresholdFilter applies a Cut out pixels smaller than the threshold to an object.
 * The threshold can be set.
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 */
function BloomThresholdFilter()
{
    PIXI.Filter.call(this,
        // vertex shader
        "#define GLSLIFY 1\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",
        // fragment shader
        "precision mediump float;\n#define GLSLIFY 1\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float threshold;\n\nvoid main(void)\n{\n   gl_FragColor = texture2D(uSampler, vTextureCoord);\n   float luminance = ( 0.298912 * gl_FragColor.r + 0.586611 * gl_FragColor.g + 0.114478 * gl_FragColor.b );\n   if(luminance < threshold)\n   {\n       gl_FragColor = vec4(0.0);\n   }\n}\n"
    );

    this.threshold = 0.85;
}

BloomThresholdFilter.prototype = Object.create(PIXI.Filter.prototype);
BloomThresholdFilter.prototype.constructor = BloomThresholdFilter;
module.exports = BloomThresholdFilter;

Object.defineProperties(BloomThresholdFilter.prototype, {
    /**
     * brightness threshold.
     *
     * @member {PIXI.Point}
     * @memberof PIXI.filters.BloomThresholdFilter#
     */
    threshold: {
        get: function ()
        {
            return this.uniforms.threshold;
        },
        set: function (value)
        {
            this.uniforms.threshold = value;
        }
    }
});

},{}],4:[function(require,module,exports){
require('../check');

var filters = {
    BloomFilter: require('./BloomFilter'),
    BloomIntensityFilter: require('./BloomIntensityFilter'),
    BloomThresholdFilter: require('./BloomThresholdFilter')
};

Object.assign(PIXI.filters, filters);

// Export for requiring
if (typeof module !== 'undefined' && module.exports) {
    module.exports = filters;
}
},{"../check":5,"./BloomFilter":1,"./BloomIntensityFilter":2,"./BloomThresholdFilter":3}],5:[function(require,module,exports){
// Make sure PIXI global object is available
if (typeof PIXI === "undefined") {
    throw new Error('pixi.js is required to be included');
}
},{}]},{},[4])(4)
});