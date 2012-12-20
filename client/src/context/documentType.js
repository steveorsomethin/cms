'use strict';

define(['backbone', '../models/documentType'], function (backbone, model) {

	var DocumentTypeContext = backbone.Model.extend({
		initialize: function () {

			this.set('documentType', new model.DocumentType());
			this.set('documentTypes', new model.DocumentTypeCollection());
		}
	}) 
});