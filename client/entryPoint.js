'use strict';

define('EventBus', ['underscore', 'backbone'], function(_, backbone) {
	var eventBus = {};
	_.extend(eventBus, backbone.Events);
	return eventBus;
});

define('ApplicationContext', ['backbone', './src/model'], function(backbone, model) {
	var ApplicationContext = backbone.Model.extend({
		initialize: function() {
			//TODO: localize, move to view
			var defaultDocumentType = new model.DocumentType({name: 'New Document Type'}),
				defaultTemplate = new model.Template({name: 'New Template'});

			this.set('documentType', defaultDocumentType);
			this.set('documentTypes', new model.DocumentTypeCollection([defaultDocumentType]));
			this.set('template', defaultTemplate);
			this.set('templates', new model.TemplateCollection([defaultTemplate]));
		}
	});

	return new ApplicationContext();
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
