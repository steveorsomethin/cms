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

define([
		'jquery',
		'./src/views/main',
		'./src/commands/documentType',
		'./src/commands/template',
		'EventBus'
define('commands', [
	'./src/commands/application', 
	'./src/commands/shell', 
	'./src/commands/documentManagement',
	'./src/commands/templateManagement'
	], 
	function($, MainViewModel, DocumentTypeCommandMap, TemplateCommandMap, eventBus) {
		$(function() {
			var documentTypeMap = new DocumentTypeCommandMap(eventBus),
			templateMap = new TemplateCommandMap(eventBus);

			MainViewModel.start($('body'));

			eventBus.trigger('loadDocumentTypes');
			eventBus.trigger('loadTemplates');
	function (ApplicationCommands, ShellCommands, DocumentManagementCommands, TemplateManagementCommands) {
		var dispatcher = require('dispatcher');

			console.log('Application started');
		});
		var applicationCommands = new ApplicationCommands(dispatcher);
		var shellCommands = new ShellCommands(dispatcher);
		var documentManagementCommands = new DocumentManagementCommands(dispatcher);
		var templateManagementCommands = new TemplateManagementCommands(dispatcher);
	}
);
