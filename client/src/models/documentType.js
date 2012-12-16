'use strict';

define(['backbone', 'exports'], function (backbone, exports) {

	//
	// DocumentType

	var DocumentType = exports.DocumentType = backbone.Model.extend({
		defaults: {
			id: '',
			name: '',
			type: 'object',
			additionalProperties: false
		}
	})

	//
	// DocumentTypeCollection

	var DocumentTypeCollection = exports.DocumentTypeCollection = backbone.Collection.extend({
		model: DocumentType,
		url: '/documentTypes'
	})
});