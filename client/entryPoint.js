'use strict';

//
// dispatcher - application event aggregator

define('dispatcher', ['underscore', 'backbone'], function(_, backbone) {
	var eventBus = {};
	_.extend(eventBus, backbone.Events);
	return eventBus;
});


define([
		'jquery',
		'./src/views/main',
		'./src/commands/documentType',
		'./src/commands/template',
		'EventBus'
	], 
	function($, MainViewModel, DocumentTypeCommandMap, TemplateCommandMap, eventBus) {
		$(function() {
			var documentTypeMap = new DocumentTypeCommandMap(eventBus),
			templateMap = new TemplateCommandMap(eventBus);

			MainViewModel.start($('body'));

			eventBus.trigger('loadDocumentTypes');
			eventBus.trigger('loadTemplates');

			console.log('Application started');
		});
	}
);
