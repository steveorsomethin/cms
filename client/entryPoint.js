'use strict';

//
// dispatcher - application event aggregator

define('dispatcher', ['underscore', 'backbone'], function(_, backbone) {
	var eventBus = {};
	_.extend(eventBus, backbone.Events);
	return eventBus;
});

//
// commands - instantiates all command maps

define('commands', [
	'dispatcher',
	'./src/commands/application', 
	'./src/commands/shell', 
	'./src/commands/documentModule',
	'./src/commands/templateModule'
	], 
	function (dispatcher, ApplicationCommands, ShellCommands, DocumentModuleCommands, TemplateModuleCommands) {
		var commands = [
			new ApplicationCommands(dispatcher),
			new ShellCommands(dispatcher),
			new DocumentModuleCommands(dispatcher),
			new TemplateModuleCommands(dispatcher)
		]
	}
);

//
// entryPoint - loads all modules required to start the application

define(['jquery', 'backbone', 'dispatcher', 'commands'], function($, backbone, dispatcher) {
	var contexts = [];
	var commands = [];

	$(function () {
		dispatcher.trigger('application:start', { 'element': $('body').get(0) });

		if (backbone.History.started) {
			backbone.History.start();
		}

		console.log('Application started')
	});
});
