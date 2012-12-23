'use strict';

define(['../core/commandMap', '../context/documentModule', '../models/documentModule', 'dispatcher'], function (CommandMap, context, model, dispatcher) {

	return CommandMap.extend({
		events: {
			'documentTypes:load': 'loadDocumentTypes',
			'documentType:select': 'selectDocumentType',
			'documentType:create': 'createDocumentType',
			'documentType:remove': 'removeDocumentType'
		},

		loadDocumentTypes: function () {
			context.get('documentTypes').fetch();
		},

		selectDocumentType: function (e) {
			context.set('documentType', e.documentType);
		},

		createDocumentType: function () {
			var documentType = new model.DocumentType({ name: 'New Document Type'});

			context.get('documentTypes').add(documentType);
			dispatcher.trigger('documentType:selected', { 'documentType': documentType });
		},

		removeDocumentType: function (e) {
			context.get('documentTypes').remove(e.documentType);
		}
	})
});