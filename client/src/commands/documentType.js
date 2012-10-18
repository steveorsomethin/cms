'use strict';

define([
		'ApplicationContext',
		'EventBus',
		'../core/commandMap',
		'../model'
	], 
	function(applicationContext, eventBus, CommandMap, model) {
		return CommandMap.extend({
			events: {
				'addProperty': 'addProperty',
				'selectDocumentType': 'selectDocumentType',
				'createDocumentType': 'createDocumentType'
			},

			addProperty: function(propertyList) {
				var properties = propertyList || applicationContext.get('documentType').get('properties');
				properties.add(new model.Property());
			},

			selectDocumentType: function(documentType) {
				applicationContext.set('documentType', documentType);
			},

			createDocumentType: function() {
				var newDocumentType = new model.DocumentType({name: 'New Document Type'});
				applicationContext.get('documentTypes').add(newDocumentType);
				eventBus.trigger('selectDocumentType', newDocumentType);
			},
		});
	}
);