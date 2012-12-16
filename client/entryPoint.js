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
	'./src/commands/application', 
	'./src/commands/shell', 
	'./src/commands/documentManagement',
	'./src/commands/templateManagement'
	], 
	function (ApplicationCommands, ShellCommands, DocumentManagementCommands, TemplateManagementCommands) {
		var dispatcher = require('dispatcher');

		var applicationCommands = new ApplicationCommands(dispatcher);
		var shellCommands = new ShellCommands(dispatcher);
		var documentManagementCommands = new DocumentManagementCommands(dispatcher);
		var templateManagementCommands = new TemplateManagementCommands(dispatcher);
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
	});
});
