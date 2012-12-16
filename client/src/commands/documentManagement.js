'use strict';

define(['../core/commandMap', '../context/documentManagement', 'dispatcher'], function (CommandMap, context, dispatcher) {

	return CommandMap.extend({
		events: {
			'documentTypes:load': 'loadDocumentTypes',
			'documentType:selected': 'selectDocumentType'
		},

		loadDocumentTypes: function () {
			context.get('documentTypes').fetch();
		},

		selectDocumentType: function (e) {
			context.set('documentType', e.documentType);
		}
	})
});