'use strict';

define(['../core/commandMap', '../context/documentManagement', 'dispatcher'], function (CommandMap, context, dispatcher) {

	return CommandMap.extend({
		events: {
			'documentTypes:load': 'loadDocumentTypes'
		},

		loadDocumentTypes: function () {
			context.get('documentTypes').fetch();
		}
	})
});