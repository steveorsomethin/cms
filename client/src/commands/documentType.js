'use strict';

define([
		'backbone',
		'ApplicationContext',
		'dispatcher',
		'../core/commandMap',
		'../model'
	],
	function(backbone, applicationContext, eventBus, CommandMap, model) {
		return CommandMap.extend({
			events: {
				'addProperty': 'addProperty',
				'removeProperty': 'removeProperty',
				'loadDocumentTypes': 'loadDocumentTypes',
				'saveDocumentType': 'saveDocumentType',
				'selectDocumentType': 'selectDocumentType',
				'createDocumentType': 'createDocumentType'
			},

			addProperty: function() {
				var properties = applicationContext.get('documentType').get('properties');
				//TODO: localize, move to view
				properties.add(new model.Property());
			},

			removeProperty: function(property) {
				var properties = applicationContext.get('documentType').get('properties');
				properties.remove(property);
			},

			loadDocumentTypes: function() {
				var documentTypes = applicationContext.get('documentTypes');
				documentTypes.url = '/services/documentTypes';
				documentTypes.fetch();
			},

			saveDocumentType: function() {
				var documentType = applicationContext.get('documentType');
				backbone.sync('update', documentType, {url: '/documentTypes/' + documentType.get('name')});
			},

			selectDocumentType: function(documentType) {
				applicationContext.set('documentType', documentType);
			},

			createDocumentType: function() {
				var newDocumentType = new model.DocumentType({name: 'New Document Type'});
				applicationContext.get('documentTypes').add(newDocumentType);
				eventBus.trigger('selectDocumentType', newDocumentType);
			}
		});
	}
);