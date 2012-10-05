define(['backbone'], function(backbone) {
	var DocumentType = backbone.Model.extend({
		initialize: function(name) {
			this.set('name', name);
		},

		defaults: {
		    type: "object",
		    additionalProperties: false,
		    properties: {}
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
