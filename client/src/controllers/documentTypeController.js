'use strict';

define(['backbone', '../model'], function (backbone, model) {

	var DocumentTypeController = backbone.Model.extend({
		constructor: function () {

			this.set('documentType', null);
			this.set('documentTypeCollection', new model.DocumentTypeCollection());
		},

		getDocumentTypes: function () {
			this.get('documentTypeCollection').fetch();
		}
	});

	return new DocumentTypeController();
});