'use strict';

var require = {
	paths: {
		order: './deps/requirejs/order',
		text: './deps/requirejs/text',
		jquery: './deps/jquery/jquery-1.7.2.min',
		underscore: './deps/underscore/underscore',
		backbone: './deps/backbone/backbone',
		dust: './deps/dust/dust',
		infuser: './deps/knockout/infuser',
		trafficCop: './deps/knockout/trafficCop',
		knockout: './deps/knockout/knockout',
		knockback: './deps/knockback/knockback-min',
		ace: './deps/ace/ace-shim',
		bootstrap: './deps/bootstrap/bootstrap'
	},

	deps: [
		'order!jquery',
		'order!bootstrap',
		'order!underscore',
		'order!backbone',
		'order!src/core/bindings',
		'order!./entryPoint'
	],

	callback: function($, bootstrap, _, backbone) {
		//Remove our helper libs from the global namespace
		$.noConflict();
		_.noConflict();
		backbone.noConflict();

		backbone.$ = $;

		console.log('Configuration loaded');
	}
};