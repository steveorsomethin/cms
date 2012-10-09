'use strict';

define('EventBus', ['underscore', 'backbone'], function(_, backbone) {
    var eventBus = {};
    _.extend(eventBus, backbone.Events);
    return eventBus;
});

define('ApplicationContext', ['./lib/model'], function(model) {
    return {
        documentType: new model.DocumentType('test')
    };
});

define([
	'jquery',
	'EventBus',
	'./lib/views/ko/main',
	'./lib/commands/documentType'
	], 
	function($, eventBus, MainViewModel, DocumentTypeCommandMap) {
		$(function() {
			var documentTypeMap = new DocumentTypeCommandMap(eventBus);
			MainViewModel.start($('body'));

			console.log('Application started');
		});
	}
);
