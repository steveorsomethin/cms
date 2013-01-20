'use strict';

define(['../core/commandMap', '../context/documentModule', '../models/documentModule', 'dispatcher'], function (CommandMap, context, model, dispatcher) {

	return CommandMap.extend({
		events: {
			'documentTypes:load': 'loadDocumentTypes',
			'documentType:select': 'selectDocumentType',
			'documentType:create': 'createDocumentType',
			'documentType:remove': 'removeDocumentType',

			'documentType:addProperty': 'addProperty',
			'documentType:removeProperty': 'removeProperty'
		},

		loadDocumentTypes: function () {
			context.get('documentTypes').fetch({
				success: function (collection) {
					dispatcher.trigger('documentType:select', { 'documentType': collection.first() });
				}
			});
		},

		selectDocumentType: function (e) {
			context.set('documentType', e.documentType);
		},

		createDocumentType: function (e) {
			var documentType = new model.DocumentType(e.documentType);
			var documentTypes = context.get('documentTypes');

			documentTypes.add(documentType);
			dispatcher.trigger('documentType:select', { 'documentType': documentType });
		},

		removeDocumentType: function (e) {
			context.get('documentTypes').remove(e.documentType);
		},

		addProperty: function (e) {
			var property = new model.Property(e.property);
			var properties = context.get('documentType').get('properties');

			if (!properties.contains(property)) {
				properties.add(property);
			}
		},

		removeProperty: function (e) {
			context.get('documentType').get('properties').remove(e.property);
		}
	})
});