'use strict';

define('EventBus', ['underscore', 'backbone'], function(_, backbone) {
    var eventBus = {};
    _.extend(eventBus, backbone.Events);
    return eventBus;
});

define('ApplicationContext', ['backbone', './src/model'], function(backbone, model) {
    var ApplicationContext = backbone.Model.extend({
    	initialize: function() {
    		var defaultDocumentType = new model.DocumentType({name: 'New Document Type'});
    		this.set('documentType', defaultDocumentType);
    		this.set('documentTypes', new model.DocumentTypeCollection([defaultDocumentType]));
    	}
    });

    return new ApplicationContext();
});

define([
		'jquery',
		'EventBus',
		'./src/views/main',
		'./src/commands/documentType'
	], 
	function($, eventBus, MainViewModel, DocumentTypeCommandMap) {
		$(function() {
			var documentTypeMap = new DocumentTypeCommandMap(eventBus);
			MainViewModel.start($('body'));

			console.log('Application started');
		});
	}
);
