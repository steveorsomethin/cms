'use strict';

define(['backbone'], function(backbone) {
	var Property = backbone.Model.extend({
		defaults: {
		    type: 'string',
		    required: false
		}
	});

	var PropertySet = backbone.Model.extend({});

	var DocumentType = backbone.Model.extend({
		initialize: function(name) {
			this.set('name', name);
		},

		defaults: {
		    type: 'object',
		    additionalProperties: false,
		    properties: new PropertySet()
		}
	});

	var DocumentTypeCollection = backbone.Collection.extend({
		model: DocumentType
	});

	return {
		DocumentType: DocumentType,
		DocumentTypeCollection: DocumentTypeCollection
	};
});
