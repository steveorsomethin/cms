'use strict';

var require = {
    paths: {
        'use': './deps/requirejs/use',
        'order': './deps/requirejs/order',
        'jquery': './deps/jquery/jquery-1.7.2.min',
        'underscore': './deps/underscore/underscore',
        'backbone': './deps/backbone/backbone',
        'knockout': './deps/knockout/knockout-min',
        'knockback': './deps/knockback/knockback-min'
    },
    deps: ['jquery', 'underscore', 'backbone', 'knockout', 'knockback', './entryPoint'],
    callback: function($, _, backbone) {
        //Remove our helper libs from the global namespace
        $.noConflict();
        _.noConflict();
        backbone.noConflict();

        backbone.setDomLibrary($);

        console.log('Configuration loaded');
    }
};