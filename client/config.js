'use strict';

var require = {
    paths: {
        'order': './deps/requirejs/order',
        'text': './deps/requirejs/text',
        'jquery': './deps/jquery/jquery-1.7.2.min',
        'underscore': './deps/underscore/underscore',
        'backbone': './deps/backbone/backbone',
        'dust': './deps/dust/dust',
        'infuser': './deps/knockout/infuser',
        'trafficCop': './deps/knockout/trafficCop',
        'knockout': './deps/knockout/knockout',
        'knockback': './deps/knockback/knockback-min'
    },
    deps: [
	    'jquery',
	    'underscore',
	    'backbone',
	    './entryPoint'],
    callback: function($, _, backbone) {
        //Remove our helper libs from the global namespace
        $.noConflict();
        _.noConflict();
        backbone.noConflict();

        backbone.setDomLibrary($);

        console.log('Configuration loaded');
    }
};