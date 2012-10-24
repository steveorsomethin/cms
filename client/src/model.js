'use strict';

define(['underscore', 'backbone'], function(_, backbone) {
	var Property = backbone.Model.extend({
		defaults: {
			name: '',
		    type: 'string',
		    required: false
		}
	});

	var PropertyCollection = backbone.Collection.extend({
		model: Property
	});

	var DocumentType = backbone.Model.extend({
		initialize: function() {
			this.set('properties', new PropertyCollection([new Property()]));
		},

		toJSON: function() {
			var i = 0, 
				json = _.clone(this.attributes),
				properties = this.get('properties'),
				property;

			json.properties = {};
			for (i = 0; i < properties.length; i++) {
				property = properties.at(i);
				json.properties[property.get('name')] = 
					{type: property.get('type'), required: property.get('required')};
			}
			
			return json;
		},

		defaults: {
			name: '',
		    type: 'object',
		    additionalProperties: false
		}
	});

	var DocumentTypeCollection = backbone.Collection.extend({
		model: DocumentType
	});

	return {
		Property: Property,
		PropertyCollection: PropertyCollection,
		DocumentType: DocumentType,
		DocumentTypeCollection: DocumentTypeCollection
	};
});
